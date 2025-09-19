import {
  CommentStatus,
  PostStatus,
  PrismaClient,
  Role,
  VoteValue,
} from "@prisma/client";
import prisma from "../db/client";

// Extended sample users (10 users)
const sampleUsers = [
  {
    email: "alex.chen@example.com",
    name: "Alex Chen",
    username: "alexchen",
    profile: {
      displayName: "Alex Chen",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      bio: "Full-stack developer and tech writer specializing in React and Node.js",
      role: Role.AUTHOR,
    },
  },
  {
    email: "sarah.kumar@example.com",
    name: "Sarah Kumar",
    username: "sarahk",
    profile: {
      displayName: "Sarah Kumar",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      bio: "Frontend specialist and UI/UX enthusiast",
      role: Role.AUTHOR,
    },
  },
  {
    email: "marcus.johnson@example.com",
    name: "Marcus Johnson",
    username: "marcusj",
    profile: {
      displayName: "Marcus Johnson",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      bio: "DevOps engineer and cloud architect",
      role: Role.AUTHOR,
    },
  },
  {
    email: "lisa.rodriguez@example.com",
    name: "Lisa Rodriguez",
    username: "lisar",
    profile: {
      displayName: "Lisa Rodriguez",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b68a4b04?w=64&h=64&fit=crop&crop=face",
      bio: "Data scientist and machine learning expert",
      role: Role.AUTHOR,
    },
  },
  {
    email: "david.kim@example.com",
    name: "David Kim",
    username: "davidk",
    profile: {
      displayName: "David Kim",
      avatarUrl:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=64&h=64&fit=crop&crop=face",
      bio: "Mobile app developer and React Native enthusiast",
      role: Role.AUTHOR,
    },
  },
  {
    email: "emma.wilson@example.com",
    name: "Emma Wilson",
    username: "emmaw",
    profile: {
      displayName: "Emma Wilson",
      avatarUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
      bio: "Backend developer and API design specialist",
      role: Role.AUTHOR,
    },
  },
  {
    email: "michael.brown@example.com",
    name: "Michael Brown",
    username: "mikeb",
    profile: {
      displayName: "Michael Brown",
      avatarUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
      bio: "Security engineer and ethical hacker",
      role: Role.AUTHOR,
    },
  },
  {
    email: "sophia.davis@example.com",
    name: "Sophia Davis",
    username: "sophiad",
    profile: {
      displayName: "Sophia Davis",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face",
      bio: "Technical writer and documentation specialist",
      role: Role.AUTHOR,
    },
  },
  {
    email: "james.miller@example.com",
    name: "James Miller",
    username: "jamesm",
    profile: {
      displayName: "James Miller",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face",
      bio: "Game developer and Unity expert",
      role: Role.AUTHOR,
    },
  },
  {
    email: "admin@technoblog.com",
    name: "Admin User",
    username: "admin",
    profile: {
      displayName: "Admin",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      bio: "Platform administrator",
      role: Role.ADMIN,
    },
  },
];

const sampleTags = [
  {
    slug: "nextjs",
    name: "Next.js",
    description: "The React framework for production",
    color: "#000000",
    isOfficial: true,
  },
  {
    slug: "react",
    name: "React",
    description: "A JavaScript library for building user interfaces",
    color: "#61DAFB",
    isOfficial: true,
  },
  {
    slug: "typescript",
    name: "TypeScript",
    description: "JavaScript with syntax for types",
    color: "#3178C6",
    isOfficial: true,
  },
  {
    slug: "prisma",
    name: "Prisma",
    description: "Next-generation Node.js and TypeScript ORM",
    color: "#2D3748",
    isOfficial: true,
  },
  {
    slug: "supabase",
    name: "Supabase",
    description: "The open source Firebase alternative",
    color: "#3ECF8E",
    isOfficial: true,
  },
  {
    slug: "tailwind",
    name: "Tailwind CSS",
    description: "A utility-first CSS framework",
    color: "#06B6D4",
    isOfficial: true,
  },
  {
    slug: "javascript",
    name: "JavaScript",
    description: "The programming language of the web",
    color: "#F7DF1E",
    isOfficial: true,
  },
  {
    slug: "web-development",
    name: "Web Development",
    description: "Building applications for the web",
    color: "#FF6B6B",
    isOfficial: true,
  },
  {
    slug: "nodejs",
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    color: "#339933",
    isOfficial: true,
  },
  {
    slug: "database",
    name: "Database",
    description: "Data storage and management",
    color: "#4CAF50",
    isOfficial: true,
  },
  {
    slug: "tutorial",
    name: "Tutorial",
    description: "Step-by-step guides and tutorials",
    color: "#FF9800",
    isOfficial: true,
  },
  {
    slug: "devops",
    name: "DevOps",
    description: "Development and operations practices",
    color: "#9C27B0",
    isOfficial: true,
  },
  {
    slug: "python",
    name: "Python",
    description: "A powerful programming language",
    color: "#3776AB",
    isOfficial: true,
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    description: "AI and machine learning technologies",
    color: "#FF5722",
    isOfficial: true,
  },
  {
    slug: "mobile",
    name: "Mobile Development",
    description: "Building mobile applications",
    color: "#607D8B",
    isOfficial: true,
  },
];

// Sample post templates for generating 40 posts
const postTemplates = [
  {
    title: "Getting Started with Next.js 15 and App Router",
    content: `# Getting Started with Next.js 15 and App Router

Next.js 15 introduces powerful new features that make building React applications even more efficient. In this comprehensive guide, we'll explore the App Router and how it revolutionizes the way we structure our applications.

## What's New in Next.js 15

The App Router is built on React Server Components and brings several advantages:

- **File-based routing**: Organize your routes using the file system
- **Nested layouts**: Create reusable layouts for different parts of your app
- **Server Components by default**: Better performance and SEO

## Setting Up Your First App Router Project

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
\`\`\`

## Creating Your First Route

In the app directory, create a new folder structure:

\`\`\`
app/
  layout.tsx
  page.tsx
  about/
    page.tsx
\`\`\`

## Server Components vs Client Components

Server Components run on the server and are great for:
- Data fetching
- Accessing backend resources
- Reducing bundle size

Client Components run in the browser and are needed for:
- Interactive elements
- Browser APIs
- State management

## Conclusion

Next.js 15 with App Router provides a powerful foundation for building modern web applications. The combination of Server Components and the new routing system makes it easier than ever to create performant, SEO-friendly applications.`,
    tags: ["nextjs", "react", "typescript", "tutorial"],
  },
  {
    title: "Building Type-Safe APIs with Prisma and TypeScript",
    content: `# Building Type-Safe APIs with Prisma and TypeScript

Type safety is crucial for building maintainable applications. In this guide, we'll explore how Prisma ORM provides excellent TypeScript integration for database operations.

## Why Prisma?

Prisma offers several advantages:

- **Type safety**: Auto-generated types from your database schema
- **Great DX**: Excellent VS Code integration with autocomplete
- **Database agnostic**: Works with PostgreSQL, MySQL, SQLite, and more

## Setting Up Prisma

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Defining Your Schema

\`\`\`prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String?
  posts Post[]
}

model Post {
  id       String @id @default(uuid())
  title    String
  content  String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
\`\`\`

## Type-Safe Queries

With Prisma, your queries are fully typed:

\`\`\`typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { posts: true }
})

// user is typed as User & { posts: Post[] } | null
\`\`\`

## Best Practices

1. Use transactions for related operations
2. Implement proper error handling
3. Use select to optimize queries
4. Consider using Prisma's middleware for logging

This approach ensures your API is both robust and maintainable.`,
    tags: ["prisma", "typescript", "database", "tutorial"],
  },
  {
    title: "Mastering Tailwind CSS: Advanced Techniques",
    content: `# Mastering Tailwind CSS: Advanced Techniques

Tailwind CSS has revolutionized how we write CSS. Let's explore advanced techniques that will make you more productive and your designs more maintainable.

## Custom Design System

Create consistent spacing and colors:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
\`\`\`

## Component Variants with CVA

\`\`\`typescript
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
\`\`\`

## Performance Optimization

1. **Purge unused styles**: Ensure your production bundle is minimal
2. **Use JIT mode**: Just-in-time compilation for faster builds
3. **Minimize specificity**: Keep selectors simple

Tailwind CSS enables rapid development while maintaining design consistency.`,
    tags: ["tailwind", "web-development", "tutorial"],
  },
];

// Function to generate random content for posts
const generateRandomPost = (index: number) => {
  const titles = [
    "Building Scalable React Applications",
    "Introduction to Machine Learning with Python",
    "Docker Best Practices for Developers",
    "GraphQL vs REST: Which to Choose?",
    "Securing Your Node.js Applications",
    "Modern CSS Grid Layout Techniques",
    "Understanding JavaScript Closures",
    "Building Mobile Apps with React Native",
    "PostgreSQL Performance Optimization",
    "Microservices Architecture Patterns",
    "Advanced React Hooks Patterns",
    "Python Data Analysis with Pandas",
    "Deploying Applications with Kubernetes",
    "Web Security Best Practices",
    "State Management in React",
    "Building APIs with Node.js and Express",
    "CSS Flexbox Complete Guide",
    "JavaScript ES2024 New Features",
    "Database Design Principles",
    "Testing React Applications",
    "Async/Await in JavaScript",
    "Building Progressive Web Apps",
    "Git Workflow Best Practices",
    "Performance Monitoring for Web Apps",
    "Understanding OAuth 2.0",
    "Building Chat Applications with WebSockets",
    "Data Visualization with D3.js",
    "Serverless Architecture with AWS Lambda",
    "Building E-commerce Applications",
    "CI/CD Pipeline Setup",
    "Redis Caching Strategies",
    "Building Real-time Applications",
    "Understanding Design Patterns",
    "API Rate Limiting Techniques",
    "Building Dashboard Applications",
    "Understanding Web Performance",
    "Building Authentication Systems",
  ];

  const tagCombinations = [
    ["react", "javascript", "tutorial"],
    ["python", "machine-learning", "tutorial"],
    ["devops", "tutorial"],
    ["javascript", "web-development"],
    ["nodejs", "web-development"],
    ["tailwind", "web-development"],
    ["javascript", "tutorial"],
    ["mobile", "react", "javascript"],
    ["database", "tutorial"],
    ["devops", "web-development"],
    ["react", "javascript"],
    ["python", "tutorial"],
    ["devops", "database"],
    ["web-development", "tutorial"],
    ["react", "javascript", "web-development"],
    ["nodejs", "javascript", "tutorial"],
    ["tailwind", "tutorial"],
    ["javascript", "web-development"],
    ["database", "web-development"],
    ["react", "javascript", "tutorial"],
  ];

  const excerpts = [
    "Learn the fundamental concepts and best practices for building scalable applications.",
    "A comprehensive guide to getting started with modern development practices.",
    "Discover advanced techniques and patterns used by professional developers.",
    "Step-by-step tutorial covering everything you need to know.",
    "Master the essential skills with practical examples and real-world scenarios.",
    "Explore the latest features and improvements in this detailed guide.",
    "Understanding core concepts with hands-on examples and explanations.",
    "Build production-ready applications following industry standards.",
    "Optimize performance and improve user experience with these techniques.",
    "Complete walkthrough from beginner to advanced level implementation.",
  ];

  const content = `# ${titles[index % titles.length]}

${excerpts[index % excerpts.length]}

## Introduction

This comprehensive guide will walk you through the essential concepts and practical implementations. We'll cover best practices, common pitfalls, and advanced techniques that will help you become more proficient.

## Key Concepts

Let's start with the fundamental concepts:

1. **Core Principles**: Understanding the underlying architecture
2. **Best Practices**: Industry-standard approaches
3. **Performance**: Optimization techniques
4. **Security**: Protecting your applications

## Implementation

Here's a practical example:

\`\`\`javascript
function example() {
  console.log('This is a sample code block');
  return 'Hello, World!';
}
\`\`\`

## Advanced Techniques

For more complex scenarios, consider these advanced patterns:

- Pattern 1: Scalable architecture design
- Pattern 2: Error handling strategies
- Pattern 3: Performance monitoring

## Best Practices

1. Always validate your inputs
2. Handle errors gracefully
3. Write comprehensive tests
4. Document your code
5. Follow consistent coding standards

## Conclusion

By following these guidelines and implementing the techniques discussed, you'll be well-equipped to build robust, scalable applications. Remember to stay updated with the latest developments and continue learning.

## Resources

- Official documentation
- Community forums
- Online tutorials
- Code examples

Keep practicing and building projects to reinforce your learning!`;

  return {
    title: titles[index % titles.length],
    content,
    excerpt: excerpts[index % excerpts.length],
    tags: tagCombinations[index % tagCombinations.length],
  };
};

// Sample comments templates
const commentTemplates = [
  "Great article! This really helped me understand the concepts better.",
  "Thanks for sharing this. The examples are very clear and practical.",
  "I've been struggling with this topic, and your explanation makes it so much easier.",
  "Excellent tutorial! Could you also cover advanced use cases?",
  "This is exactly what I was looking for. Very well written!",
  "Amazing content! I'll definitely be implementing this in my next project.",
  "Could you provide more examples for the edge cases?",
  "This approach is much cleaner than what I was using before.",
  "Thanks for the detailed explanation. The code examples are perfect.",
  "I love how you explained the reasoning behind each decision.",
  "This tutorial saved me hours of research. Thank you!",
  "Very comprehensive guide. I appreciate the step-by-step approach.",
  "The performance tips at the end are gold. Thanks for sharing!",
  "I had no idea about this technique. Mind blown! 🤯",
  "Could you create a follow-up article on the advanced patterns?",
  "This is going straight to my bookmarks. Excellent work!",
  "The visual examples really help understand the concepts.",
  "I've been using the old approach for years. Time to upgrade!",
  "Perfect timing! I was just working on something similar.",
  "Your writing style makes complex topics easy to understand.",
];

async function seed() {
  console.log("🌱 Starting comprehensive seed process...");

  try {
    // Clean up existing data (in development only)
    if (process.env.NODE_ENV === "development") {
      console.log("🧹 Cleaning up existing data...");
      await prisma.commentVote.deleteMany();
      await prisma.vote.deleteMany();
      await prisma.comment.deleteMany();
      await prisma.bookmark.deleteMany();
      await prisma.postTag.deleteMany();
      await prisma.post.deleteMany();
      await prisma.tag.deleteMany();
      await prisma.profile.deleteMany();
      await prisma.user.deleteMany();
    }

    // Create users with profiles
    console.log("👥 Creating 10 users and profiles...");
    const users = [];
    for (const userData of sampleUsers) {
      const { profile, ...userCreateData } = userData;
      const user = await prisma.user.create({
        data: {
          ...userCreateData,
          profile: {
            create: profile,
          },
        },
        include: {
          profile: true,
        },
      });
      users.push(user);
      console.log(`   ✅ Created user: ${user.name}`);
    }

    // Create tags
    console.log("🏷️  Creating tags...");
    const tags = [];
    for (const tagData of sampleTags) {
      const tag = await prisma.tag.create({
        data: tagData,
      });
      tags.push(tag);
    }
    console.log(`   ✅ Created ${tags.length} tags`);

    // Create a map of tag slug to tag id for easier lookup
    const tagMap = new Map(tags.map((tag) => [tag.slug, tag.id]));

    // Create 40 posts
    console.log("📝 Creating 40 posts...");
    const authorUsers = users.filter(
      (user) => user.profile?.role === Role.AUTHOR
    );
    const posts = [];

    for (let i = 0; i < 40; i++) {
      const author = authorUsers[i % authorUsers.length];
      let postData: any;

      if (i < 3) {
        // Use predefined templates for first 3 posts
        postData = postTemplates[i];
      } else {
        // Generate random posts for the rest
        postData = generateRandomPost(i - 3);
      }

      // Remove tags from postData and handle separately
      const { tags: postTags, ...postCreateData } = postData;

      const post = await prisma.post.create({
        data: {
          ...postCreateData,
          slug: `${postCreateData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}-${i + 1}`,
          authorId: author.id,
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(
            Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
          ), // Random date within last 60 days
          readingTimeMs: Math.floor(Math.random() * 600000) + 180000, // 3-13 minutes
          viewCount: Math.floor(Math.random() * 1000) + 50,
          // Create tag relationships
          tags: {
            create: postTags.map((tagSlug: string) => ({
              tag: {
                connect: { id: tagMap.get(tagSlug) },
              },
            })),
          },
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      posts.push(post);

      if ((i + 1) % 10 === 0) {
        console.log(`   ✅ Created ${i + 1}/40 posts`);
      }
    }

    console.log("👍 Adding votes to posts...");
    // Add votes to posts
    for (const post of posts) {
      const voteCount = Math.floor(Math.random() * 25) + 5; // 5-30 votes per post
      const voterUsers = users
        .sort(() => 0.5 - Math.random())
        .slice(0, voteCount);

      for (const voter of voterUsers) {
        try {
          await prisma.vote.create({
            data: {
              userId: voter.id,
              postId: post.id,
              value:
                Math.random() > 0.15 ? VoteValue.UPVOTE : VoteValue.DOWNVOTE, // 85% upvotes, 15% downvotes
            },
          });
        } catch (error) {
          // Ignore duplicate vote errors
        }
      }
    }

    console.log("💬 Adding comments to posts...");
    // Add comments to posts
    for (const post of posts) {
      const commentCount = Math.floor(Math.random() * 8) + 2; // 2-10 comments per post
      const commenters = users
        .sort(() => 0.5 - Math.random())
        .slice(0, commentCount);

      const topLevelComments = [];

      for (let i = 0; i < commenters.length; i++) {
        const commenter = commenters[i];
        const comment = await prisma.comment.create({
          data: {
            postId: post.id,
            authorId: commenter.id,
            body: commentTemplates[
              Math.floor(Math.random() * commentTemplates.length)
            ],
            status: CommentStatus.APPROVED,
            createdAt: new Date(
              post.publishedAt!.getTime() +
                Math.random() * 7 * 24 * 60 * 60 * 1000
            ), // Comments after post publication
          },
        });

        topLevelComments.push(comment);

        // Add some replies (30% chance for each comment)
        if (Math.random() < 0.3 && users.length > 1) {
          const replier = users[Math.floor(Math.random() * users.length)];
          await prisma.comment.create({
            data: {
              postId: post.id,
              authorId: replier.id,
              parentId: comment.id,
              body:
                "Thanks for the feedback! " +
                commentTemplates[
                  Math.floor(Math.random() * commentTemplates.length)
                ],
              status: CommentStatus.APPROVED,
              createdAt: new Date(
                comment.createdAt.getTime() +
                  Math.random() * 24 * 60 * 60 * 1000
              ),
            },
          });
        }
      }

      // Add comment votes
      for (const comment of topLevelComments) {
        const commentVoteCount = Math.floor(Math.random() * 5) + 1; // 1-5 votes per comment
        const commentVoters = users
          .sort(() => 0.5 - Math.random())
          .slice(0, commentVoteCount);

        for (const voter of commentVoters) {
          try {
            await prisma.commentVote.create({
              data: {
                userId: voter.id,
                commentId: comment.id,
                value:
                  Math.random() > 0.2 ? VoteValue.UPVOTE : VoteValue.DOWNVOTE,
              },
            });
          } catch (error) {
            // Ignore duplicate vote errors
          }
        }
      }
    }

    console.log("🔖 Adding bookmarks...");
    // Add some bookmarks
    for (const user of users) {
      const bookmarkCount = Math.floor(Math.random() * 8) + 2; // 2-10 bookmarks per user
      const bookmarkedPosts = posts
        .sort(() => 0.5 - Math.random())
        .slice(0, bookmarkCount);

      for (const post of bookmarkedPosts) {
        try {
          await prisma.bookmark.create({
            data: {
              userId: user.id,
              postId: post.id,
            },
          });
        } catch (error) {
          // Ignore duplicate bookmark errors
        }
      }
    }

    console.log("📊 Updating post counters...");
    // Update post counters based on actual data
    for (const post of posts) {
      const [upvotes, downvotes, comments] = await Promise.all([
        prisma.vote.count({
          where: { postId: post.id, value: VoteValue.UPVOTE },
        }),
        prisma.vote.count({
          where: { postId: post.id, value: VoteValue.DOWNVOTE },
        }),
        prisma.comment.count({
          where: { postId: post.id, status: CommentStatus.APPROVED },
        }),
      ]);

      await prisma.post.update({
        where: { id: post.id },
        data: {
          upvoteCount: upvotes,
          downvoteCount: downvotes,
          commentCount: comments,
        },
      });
    }

    // Update search vectors for all posts
    console.log("🔍 Updating search vectors...");
    for (const post of posts) {
      await prisma.$executeRaw`SELECT refresh_post_search_vector(${post.id}::uuid)`;
    }

    console.log("✅ Comprehensive seed process completed successfully!");
    console.log(`   📊 Summary:`);
    console.log(`   👥 Created ${users.length} users`);
    console.log(`   🏷️  Created ${tags.length} tags`);
    console.log(`   📝 Created ${posts.length} posts`);
    console.log(`   💬 Created comments with replies`);
    console.log(`   👍 Added votes to posts and comments`);
    console.log(`   🔖 Added user bookmarks`);
    console.log(`   🔍 Updated search vectors`);
  } catch (error) {
    console.error("❌ Error during seed process:", error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seed()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seed;
