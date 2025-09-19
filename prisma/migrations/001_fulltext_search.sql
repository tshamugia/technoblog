-- Full-text search setup for posts
-- This migration adds PostgreSQL full-text search capabilities

-- 1) Create the tsvector column for search if it doesn't exist
-- (This should already be in the schema, but we ensure it exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'search_vector'
    ) THEN
        ALTER TABLE posts ADD COLUMN search_vector tsvector;
    END IF;
END $$;

-- 2) Helper function: refresh search vector for a single post
CREATE OR REPLACE FUNCTION refresh_post_search_vector(p_post_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_title text;
  v_content text;
  v_excerpt text;
  v_tags text;
BEGIN
  -- Get post content
  SELECT title, content_md, excerpt INTO v_title, v_content, v_excerpt
  FROM posts
  WHERE id = p_post_id;

  -- Get associated tags
  SELECT COALESCE(string_agg(t.name, ' '), '')
  INTO v_tags
  FROM post_tags pt
  JOIN tags t ON t.id = pt.tag_id
  WHERE pt.post_id = p_post_id;

  -- Update the search vector with weighted content
  -- A = highest weight (title), B = medium (excerpt), C = content, D = lowest (tags)
  UPDATE posts
  SET search_vector = 
      setweight(to_tsvector('english', COALESCE(v_title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(v_excerpt, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(substring(v_content, 1, 10000), '')), 'C') ||
      setweight(to_tsvector('english', COALESCE(v_tags, '')), 'D')
  WHERE id = p_post_id;
END $$;

-- 3) Trigger function for posts table changes
CREATE OR REPLACE FUNCTION trigger_refresh_post_search_vector()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Only refresh if content-related fields changed
  IF TG_OP = 'INSERT' OR 
     (TG_OP = 'UPDATE' AND (
       OLD.title IS DISTINCT FROM NEW.title OR
       OLD.content_md IS DISTINCT FROM NEW.content_md OR
       OLD.excerpt IS DISTINCT FROM NEW.excerpt
     )) THEN
    PERFORM refresh_post_search_vector(NEW.id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END $$;

-- 4) Create triggers on posts table
DROP TRIGGER IF EXISTS posts_search_vector_update ON posts;
CREATE TRIGGER posts_search_vector_update
  AFTER INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION trigger_refresh_post_search_vector();

-- 5) Trigger function for post_tags changes
CREATE OR REPLACE FUNCTION trigger_refresh_post_search_vector_tags()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_post_id uuid;
BEGIN
  -- Get the post_id from either NEW or OLD record
  v_post_id := COALESCE(NEW.post_id, OLD.post_id);
  
  -- Refresh the search vector for the affected post
  PERFORM refresh_post_search_vector(v_post_id);
  
  RETURN COALESCE(NEW, OLD);
END $$;

-- 6) Create triggers on post_tags table
DROP TRIGGER IF EXISTS post_tags_search_vector_update ON post_tags;
CREATE TRIGGER post_tags_search_vector_update
  AFTER INSERT OR UPDATE OR DELETE ON post_tags
  FOR EACH ROW EXECUTE FUNCTION trigger_refresh_post_search_vector_tags();

-- 7) Create GIN index for fast full-text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_search_vector 
ON posts USING GIN (search_vector);

-- 8) Additional useful indexes for search and filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_status_published_at 
ON posts (status, published_at DESC) WHERE status = 'PUBLISHED';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_published 
ON posts (author_id, published_at DESC) WHERE status = 'PUBLISHED';

-- 9) Backfill existing posts (run this after initial migration)
-- This will populate search_vector for all existing posts
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM posts LOOP
    PERFORM refresh_post_search_vector(rec.id);
  END LOOP;
END $$;

-- 10) Create helpful views for search functionality
CREATE OR REPLACE VIEW published_posts_with_search AS
SELECT 
  p.*,
  pr.display_name as author_name,
  pr.avatar_url as author_avatar,
  array_agg(t.name) FILTER (WHERE t.name IS NOT NULL) as tag_names,
  array_agg(t.slug) FILTER (WHERE t.slug IS NOT NULL) as tag_slugs
FROM posts p
JOIN profiles pr ON pr.user_id = p.author_id
LEFT JOIN post_tags pt ON pt.post_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id, pr.display_name, pr.avatar_url;

-- 11) Helper function for search with ranking
CREATE OR REPLACE FUNCTION search_posts(
  search_query text,
  limit_count int DEFAULT 20,
  offset_count int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  excerpt text,
  author_name text,
  author_avatar text,
  tag_names text[],
  published_at timestamptz,
  upvote_count int,
  comment_count int,
  view_count int,
  rank real
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.author_name,
    p.author_avatar,
    p.tag_names,
    p.published_at,
    p.upvote_count,
    p.comment_count,
    p.view_count,
    ts_rank_cd(p.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM published_posts_with_search p
  WHERE p.search_vector @@ websearch_to_tsquery('english', search_query)
  ORDER BY 
    ts_rank_cd(p.search_vector, websearch_to_tsquery('english', search_query)) DESC,
    p.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END $$;