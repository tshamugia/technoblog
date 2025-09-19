import { Prisma } from "@prisma/client";
import { cache } from "react";
import prisma from "@/db/client";
import {
  type CreatePostData,
  convertPostForUI,
  failure,
  type PaginatedResponse,
  type Post,
  type PostFilters,
  type PostWithDetails,
  type Result,
  success,
  type UpdatePostData,
} from "@/types/database";

// Calculate reading time in milliseconds
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil((wordCount / wordsPerMinute) * 60 * 1000);
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Cached post retrieval
export const getPostBySlug = cache(
  async (slug: string): Promise<Result<Post | null>> => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          slug,
          status: "PUBLISHED",
        },
        include: {
          author: { include: { profile: true } },
          tags: { include: { tag: true } },
          _count: {
            select: {
              comments: { where: { status: "APPROVED" } },
              votes: { where: { value: "UPVOTE" } },
              bookmarks: true,
              views: true,
            },
          },
        },
      });

      if (!post) {
        return success(null);
      }

      return success(convertPostForUI(post));
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      return failure("Failed to fetch post");
    }
  }
);

export async function getPosts(
  filters: PostFilters = {}
): Promise<Result<PaginatedResponse<Post>>> {
  try {
    const {
      status = "PUBLISHED",
      authorId,
      tagIds,
      search,
      featured,
      sortBy = "latest",
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PostWhereInput = {
      status,
      ...(authorId && { authorId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
          { contentMd: { contains: search, mode: "insensitive" } },
          {
            tags: {
              some: {
                tag: {
                  name: { contains: search, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }),
      ...(tagIds?.length && {
        tags: { some: { tagId: { in: tagIds } } },
      }),
    };

    // Build order by clause
    let orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (sortBy) {
      case "popular":
        orderBy = { upvoteCount: "desc" };
        break;
      case "views":
        orderBy = { viewCount: "desc" };
        break;
      case "oldest":
        orderBy = { publishedAt: "asc" };
        break;
      case "latest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { include: { profile: true } },
          tags: { include: { tag: true } },
          _count: {
            select: {
              comments: { where: { status: "APPROVED" } },
              votes: { where: { value: "UPVOTE" } },
              bookmarks: true,
              views: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const convertedPosts = posts.map(convertPostForUI);

    return success({
      data: convertedPosts,
      total,
      page,
      limit,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return failure("Failed to fetch posts");
  }
}

export async function createPost(
  authorId: string,
  data: CreatePostData
): Promise<Result<Post>> {
  try {
    const readingTimeMs = calculateReadingTime(data.contentMd);
    const slug = data.slug || generateSlug(data.title);

    const post = await prisma.$transaction(async (tx) => {
      // Create the post
      const newPost = await tx.post.create({
        data: {
          ...data,
          slug,
          authorId,
          readingTimeMs,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        },
        include: {
          author: { include: { profile: true } },
          tags: { include: { tag: true } },
          _count: {
            select: {
              comments: { where: { status: "APPROVED" } },
              votes: { where: { value: "UPVOTE" } },
              bookmarks: true,
              views: true,
            },
          },
        },
      });

      // Connect tags if provided
      if (data.tagIds?.length) {
        await tx.postTag.createMany({
          data: data.tagIds.map((tagId) => ({
            postId: newPost.id,
            tagId,
          })),
        });
      }

      return newPost;
    });

    return success(convertPostForUI(post));
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return failure("A post with this slug already exists", 409);
      }
    }
    return failure("Failed to create post");
  }
}

export async function updatePost(data: UpdatePostData): Promise<Result<Post>> {
  try {
    const { id, tagIds, ...updateData } = data;

    // Calculate reading time if content changed
    const readingTimeMs = updateData.contentMd
      ? calculateReadingTime(updateData.contentMd)
      : undefined;

    const post = await prisma.$transaction(async (tx) => {
      // Update post
      const updatedPost = await tx.post.update({
        where: { id },
        data: {
          ...updateData,
          ...(readingTimeMs && { readingTimeMs }),
          ...(updateData.status === "PUBLISHED" && { publishedAt: new Date() }),
        },
        include: {
          author: { include: { profile: true } },
          tags: { include: { tag: true } },
          _count: {
            select: {
              comments: { where: { status: "APPROVED" } },
              votes: { where: { value: "UPVOTE" } },
              bookmarks: true,
              views: true,
            },
          },
        },
      });

      // Update tags if provided
      if (tagIds !== undefined) {
        // Remove existing tags
        await tx.postTag.deleteMany({
          where: { postId: id },
        });

        // Add new tags
        if (tagIds.length > 0) {
          await tx.postTag.createMany({
            data: tagIds.map((tagId) => ({
              postId: id,
              tagId,
            })),
          });
        }
      }

      return updatedPost;
    });

    return success(convertPostForUI(post));
  } catch (error) {
    console.error("Error updating post:", error);
    return failure("Failed to update post");
  }
}

export async function deletePost(id: string): Promise<Result<void>> {
  try {
    await prisma.post.delete({
      where: { id },
    });

    return success(undefined);
  } catch (error) {
    console.error("Error deleting post:", error);
    return failure("Failed to delete post");
  }
}

export async function incrementPostViews(
  postId: string,
  date: Date = new Date()
): Promise<Result<void>> {
  try {
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    await prisma.$transaction([
      // Upsert the view count for today
      prisma.postView.upsert({
        where: {
          postId_date: {
            postId,
            date: today,
          },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          postId,
          date: today,
          count: 1,
        },
      }),
      // Increment the total counter on the post
      prisma.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
      }),
    ]);

    return success(undefined);
  } catch (error) {
    console.error("Error incrementing post views:", error);
    return failure("Failed to record view");
  }
}

export async function getFeaturedPosts(limit = 6): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        // Using upvoteCount as a proxy for featured posts since there's no featured field
      },
      include: {
        author: { include: { profile: true } },
        tags: { include: { tag: true } },
        _count: {
          select: {
            comments: { where: { status: "APPROVED" } },
            votes: { where: { value: "UPVOTE" } },
            bookmarks: true,
            views: true,
          },
        },
      },
      orderBy: { upvoteCount: "desc" },
      take: limit,
    });

    const convertedPosts = posts.map(convertPostForUI);
    return convertedPosts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getPopularPosts(limit = 10): Promise<Result<Post[]>> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: { include: { profile: true } },
        tags: { include: { tag: true } },
        _count: {
          select: {
            comments: { where: { status: "APPROVED" } },
            votes: { where: { value: "UPVOTE" } },
            bookmarks: true,
            views: true,
          },
        },
      },
      orderBy: [{ upvoteCount: "desc" }, { viewCount: "desc" }],
      take: limit,
    });

    const convertedPosts = posts.map(convertPostForUI);
    return success(convertedPosts);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return failure("Failed to fetch popular posts");
  }
}

export async function getRelatedPosts(
  postId: string,
  limit = 4
): Promise<Result<Post[]>> {
  try {
    // Get the current post's tags
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { tags: true },
    });

    if (!currentPost) {
      return failure("Post not found");
    }

    const tagIds = currentPost.tags.map((pt) => pt.tagId);

    if (tagIds.length === 0) {
      // If no tags, return latest posts
      const result = await getPosts({ limit, sortBy: "latest" });
      if (result.ok) {
        return success(
          result.data.data.filter((p) => p.id !== postId).slice(0, limit)
        );
      }
      return result;
    }

    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: postId },
        tags: {
          some: {
            tagId: { in: tagIds },
          },
        },
      },
      include: {
        author: { include: { profile: true } },
        tags: { include: { tag: true } },
        _count: {
          select: {
            comments: { where: { status: "APPROVED" } },
            votes: { where: { value: "UPVOTE" } },
            bookmarks: true,
            views: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    const convertedPosts = posts.map(convertPostForUI);
    return success(convertedPosts);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return failure("Failed to fetch related posts");
  }
}

// Additional UI-compatible functions
export async function getLatestPosts(limit = 10): Promise<Post[]> {
  try {
    const result = await getPosts({ limit, sortBy: "latest" });
    return result.ok ? result.data.data : [];
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

export async function getAllPosts(
  filters: {
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: "latest" | "popular" | "oldest";
  } = {}
): Promise<Post[]> {
  try {
    const { category, tag, search, sortBy = "latest" } = filters;

    // Convert tag slug to tagId if provided
    let tagIds: string[] | undefined;
    if (tag) {
      const tagRecord = await prisma.tag.findUnique({
        where: { slug: tag },
      });
      if (tagRecord) {
        tagIds = [tagRecord.id];
      }
    }

    const result = await getPosts({
      tagIds,
      search,
      sortBy,
      limit: 1000, // Large limit for "all posts"
    });

    return result.ok ? result.data.data : [];
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}
