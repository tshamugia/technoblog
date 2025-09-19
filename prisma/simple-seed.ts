import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create users with profiles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alex@technoblog.com",
        name: "Alex Chen",
        username: "alexchen",
        profile: {
          create: {
            displayName: "Alex Chen",
            role: "ADMIN",
            bio: "Full-stack developer and tech lead with 8+ years of experience. Passionate about clean code, scalable architecture, and developer experience.",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face",
            website: "https://alexchen.dev",
            github: "alexchen",
            twitter: "alexchen",
            linkedin: "alexchen",
          },
        },
      },
      include: { profile: true },
    }),
    prisma.user.create({
      data: {
        email: "sarah@technoblog.com",
        name: "Sarah Kumar",
        username: "sarahkumar",
        profile: {
          create: {
            displayName: "Sarah Kumar",
            role: "AUTHOR",
            bio: "Frontend developer and designer who loves creating beautiful, accessible user interfaces. Expert in React, TypeScript, and modern CSS.",
            avatarUrl:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face",
            github: "sarahkumar",
            twitter: "sarahkumar",
            linkedin: "sarahkumar",
          },
        },
      },
      include: { profile: true },
    }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        slug: "nextjs",
        name: "Next.js",
        description: "The React framework for production",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "react",
        name: "React",
        description: "A JavaScript library for building user interfaces",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "typescript",
        name: "TypeScript",
        description: "Typed JavaScript at any scale",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "nodejs",
        name: "Node.js",
        description: "JavaScript runtime built on Chrome's V8 engine",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "javascript",
        name: "JavaScript",
        description: "The language of the web",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "css",
        name: "CSS",
        description: "Cascading Style Sheets",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "tailwind",
        name: "Tailwind CSS",
        description: "A utility-first CSS framework",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "docker",
        name: "Docker",
        description: "Containerization platform",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "aws",
        name: "AWS",
        description: "Amazon Web Services cloud platform",
        isOfficial: true,
      },
    }),
    prisma.tag.create({
      data: {
        slug: "python",
        name: "Python",
        description: "A powerful programming language",
        isOfficial: true,
      },
    }),
  ]);

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        authorId: users[0].id,
        title:
          "Building Scalable Applications with Next.js 15 and Server Components",
        slug: "nextjs-15-server-components-guide",
        contentMd: `# Building Scalable Applications with Next.js 15 and Server Components

Next.js 15 introduces powerful new features that make building scalable applications easier than ever. In this comprehensive guide, we'll explore how to leverage Server Components, the new App Router, and advanced caching strategies to create high-performance web applications.

## Introduction to Server Components

Server Components represent a paradigm shift in how we think about React applications. Unlike traditional client-side rendering, Server Components are rendered on the server and sent to the client as HTML.

### Key Benefits

- **Reduced Bundle Size**: Server Components don't add to your JavaScript bundle
- **Direct Database Access**: Query your database directly without APIs
- **Improved SEO**: Content is available immediately for search engines
- **Better Performance**: Faster initial page loads and better Core Web Vitals

## Getting Started

Let's start by creating a new Next.js 15 project:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm install
\`\`\`

This sets up a new project with TypeScript and Tailwind CSS configured.

## Implementing Server Components

Here's how to create your first Server Component:

\`\`\`tsx
// app/posts/page.tsx
import { getPosts } from '@/lib/posts'

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <div>
      <h1>Latest Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
\`\`\`

## Advanced Patterns

Server Components also support advanced patterns like streaming and selective hydration.

## Conclusion

Next.js 15 with Server Components offers a powerful way to build scalable, performant web applications. Start experimenting with these patterns today!`,
        excerpt:
          "Learn how to leverage Next.js 15's latest features including Server Components to build highly performant and scalable web applications.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
        status: "PUBLISHED",
        publishedAt: new Date("2024-01-15T10:00:00Z"),
        readingTimeMs: 480000,
        viewCount: 1250,
        upvoteCount: 89,
        commentCount: 12,
      },
    }),
    prisma.post.create({
      data: {
        authorId: users[1].id,
        title: "Modern CSS Techniques for Better Web Design",
        slug: "modern-css-techniques-web-design",
        contentMd: `# Modern CSS Techniques for Better Web Design

CSS has evolved tremendously over the past few years. With new features like CSS Grid, Flexbox, and custom properties, we can create more sophisticated and maintainable designs than ever before.

## CSS Grid Layout

CSS Grid is perfect for creating complex layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

## Custom Properties (CSS Variables)

CSS custom properties enable dynamic theming:

\`\`\`css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

.button {
  background-color: var(--primary-color);
  color: white;
}
\`\`\`

## Container Queries

The latest addition to CSS that allows responsive design based on container size:

\`\`\`css
@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
\`\`\`

Modern CSS gives us incredible power to create beautiful, responsive designs with clean, maintainable code.`,
        excerpt:
          "Explore the latest CSS features and techniques that will improve your web design workflow and create better user experiences.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop",
        status: "PUBLISHED",
        publishedAt: new Date("2024-01-12T14:30:00Z"),
        readingTimeMs: 360000,
        viewCount: 892,
        upvoteCount: 67,
        commentCount: 8,
      },
    }),
  ]);

  // Connect tags to posts
  await prisma.postTag.createMany({
    data: [
      { postId: posts[0].id, tagId: tags[0].id }, // Next.js
      { postId: posts[0].id, tagId: tags[1].id }, // React
      { postId: posts[0].id, tagId: tags[2].id }, // TypeScript
      { postId: posts[1].id, tagId: tags[5].id }, // CSS
      { postId: posts[1].id, tagId: tags[6].id }, // Tailwind CSS
    ],
  });

  // Create some comments
  await prisma.comment.createMany({
    data: [
      {
        postId: posts[0].id,
        authorId: users[1].id,
        body: "Excellent guide! The Server Components explanation was particularly helpful. I've been struggling with understanding when to use them vs client components.",
        status: "APPROVED",
        upvoteCount: 5,
      },
      {
        postId: posts[0].id,
        authorId: users[0].id,
        body: "Thanks! Server Components can be tricky at first, but once you get the hang of it, they're incredibly powerful for performance.",
        status: "APPROVED",
        upvoteCount: 3,
      },
      {
        postId: posts[1].id,
        authorId: users[0].id,
        body: "CSS Grid has revolutionized how I approach layouts. Great examples here!",
        status: "APPROVED",
        upvoteCount: 4,
      },
    ],
  });

  // Create some votes
  await prisma.vote.createMany({
    data: [
      { userId: users[1].id, postId: posts[0].id, value: "UPVOTE" },
      { userId: users[0].id, postId: posts[1].id, value: "UPVOTE" },
    ],
  });

  // Create some bookmarks
  await prisma.bookmark.createMany({
    data: [
      { userId: users[1].id, postId: posts[0].id },
      { userId: users[0].id, postId: posts[1].id },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Created ${users.length} users`);
  console.log(`🏷️ Created ${tags.length} tags`);
  console.log(`📝 Created ${posts.length} posts`);
  console.log(`💬 Created comments and interactions`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
