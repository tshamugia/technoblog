import type {
  AboutPageData,
  Author,
  Category,
  Comment,
  FeaturedPost,
  Post,
  PostDetailsData,
  PostsPageData,
  SidebarData,
  Tag,
  TeamMember,
} from "@/types";

// Mock authors
const mockAuthors: Author[] = [
  {
    id: "1",
    display_name: "Alex Chen",
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    bio: "Full-stack developer and tech writer",
    role: "author",
  },
  {
    id: "2",
    display_name: "Sarah Kumar",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    bio: "Frontend specialist and UI/UX enthusiast",
    role: "author",
  },
  {
    id: "3",
    display_name: "Marcus Johnson",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    bio: "DevOps engineer and cloud architect",
    role: "author",
  },
  {
    id: "4",
    display_name: "Lisa Rodriguez",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    bio: "Data scientist and machine learning expert",
    role: "author",
  },
];

// Mock tags
const mockTags: Tag[] = [
  { id: "1", slug: "nextjs", name: "Next.js", post_count: 24 },
  { id: "2", slug: "react", name: "React", post_count: 45 },
  { id: "3", slug: "typescript", name: "TypeScript", post_count: 32 },
  { id: "4", slug: "nodejs", name: "Node.js", post_count: 28 },
  { id: "5", slug: "javascript", name: "JavaScript", post_count: 56 },
  { id: "6", slug: "css", name: "CSS", post_count: 22 },
  { id: "7", slug: "tailwind", name: "Tailwind CSS", post_count: 18 },
  { id: "8", slug: "docker", name: "Docker", post_count: 15 },
  { id: "9", slug: "aws", name: "AWS", post_count: 12 },
  { id: "10", slug: "python", name: "Python", post_count: 38 },
];

// Mock posts
export const mockFeaturedPosts: FeaturedPost[] = [
  {
    id: "1",
    author_id: "1",
    title:
      "Building Scalable Applications with Next.js 15 and Server Components",
    slug: "nextjs-15-server-components-guide",
    content_md: "",
    status: "published",
    published_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    reading_time_ms: 480000, // 8 minutes
    view_count: 1250,
    upvote_count: 89,
    comment_count: 12,
    author: mockAuthors[0],
    tags: [mockTags[0], mockTags[2], mockTags[1]],
    snippet:
      "Learn how to leverage Next.js 15's latest features including Server Components to build highly performant and scalable web applications.",
    featured_reason: "Editor's pick",
    featured_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    author_id: "2",
    title: "Modern CSS Techniques: Grid, Flexbox, and Container Queries",
    slug: "modern-css-grid-flexbox-container-queries",
    content_md: "",
    status: "published",
    published_at: "2024-01-14T14:30:00Z",
    updated_at: "2024-01-14T14:30:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    reading_time_ms: 360000, // 6 minutes
    view_count: 890,
    upvote_count: 67,
    comment_count: 8,
    author: mockAuthors[1],
    tags: [mockTags[5], mockTags[6]],
    snippet:
      "Master the latest CSS layout techniques and create responsive designs that work across all devices and screen sizes.",
    featured_reason: "Trending",
    featured_at: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    author_id: "3",
    title: "Docker Multi-Stage Builds: Optimizing Your Production Images",
    slug: "docker-multi-stage-builds-optimization",
    content_md: "",
    status: "published",
    published_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&h=400&fit=crop",
    reading_time_ms: 540000, // 9 minutes
    view_count: 654,
    upvote_count: 45,
    comment_count: 6,
    author: mockAuthors[2],
    tags: [mockTags[7], mockTags[8]],
    snippet:
      "Reduce your Docker image sizes by up to 90% using multi-stage builds and learn advanced optimization techniques.",
    featured_reason: "Popular",
    featured_at: "2024-01-13T09:15:00Z",
  },
];

export const mockLatestPosts: Post[] = [
  {
    id: "4",
    author_id: "4",
    title: "Introduction to Machine Learning with Python and Scikit-learn",
    slug: "machine-learning-python-scikit-learn-intro",
    content_md: "",
    status: "published",
    published_at: "2024-01-12T16:45:00Z",
    updated_at: "2024-01-12T16:45:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    reading_time_ms: 720000, // 12 minutes
    view_count: 432,
    upvote_count: 34,
    comment_count: 5,
    author: mockAuthors[3],
    tags: [mockTags[9], mockTags[4]],
    snippet:
      "Get started with machine learning using Python's most popular libraries. Learn the fundamentals with practical examples.",
  },
  {
    id: "5",
    author_id: "1",
    title: "TypeScript Advanced Types: Utility Types and Generic Constraints",
    slug: "typescript-advanced-utility-types-generics",
    content_md: "",
    status: "published",
    published_at: "2024-01-11T11:20:00Z",
    updated_at: "2024-01-11T11:20:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    reading_time_ms: 420000, // 7 minutes
    view_count: 567,
    upvote_count: 42,
    comment_count: 9,
    author: mockAuthors[0],
    tags: [mockTags[2], mockTags[4]],
    snippet:
      "Deep dive into TypeScript's advanced type system and learn how to create robust, type-safe applications.",
  },
  {
    id: "6",
    author_id: "2",
    title: "React Server Components vs Client Components: When to Use What",
    slug: "react-server-client-components-comparison",
    content_md: "",
    status: "published",
    published_at: "2024-01-10T13:00:00Z",
    updated_at: "2024-01-10T13:00:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    reading_time_ms: 300000, // 5 minutes
    view_count: 789,
    upvote_count: 56,
    comment_count: 11,
    author: mockAuthors[1],
    tags: [mockTags[1], mockTags[0]],
    snippet:
      "Understand the differences between Server and Client Components in React and make informed architectural decisions.",
  },
  {
    id: "7",
    author_id: "3",
    title: "AWS Lambda Cold Starts: Performance Optimization Strategies",
    slug: "aws-lambda-cold-start-optimization",
    content_md: "",
    status: "published",
    published_at: "2024-01-09T08:30:00Z",
    updated_at: "2024-01-09T08:30:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    reading_time_ms: 600000, // 10 minutes
    view_count: 345,
    upvote_count: 28,
    comment_count: 4,
    author: mockAuthors[2],
    tags: [mockTags[8], mockTags[3]],
    snippet:
      "Learn proven techniques to minimize AWS Lambda cold start times and improve your serverless application performance.",
  },
  {
    id: "8",
    author_id: "4",
    title: "Building RESTful APIs with Node.js and Express: Best Practices",
    slug: "nodejs-express-restful-api-best-practices",
    content_md: "",
    status: "published",
    published_at: "2024-01-08T15:15:00Z",
    updated_at: "2024-01-08T15:15:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    reading_time_ms: 480000, // 8 minutes
    view_count: 678,
    upvote_count: 51,
    comment_count: 7,
    author: mockAuthors[3],
    tags: [mockTags[3], mockTags[4]],
    snippet:
      "Design and implement robust RESTful APIs using Node.js and Express with proper error handling and security.",
  },
  {
    id: "9",
    author_id: "1",
    title: "CSS-in-JS vs Tailwind CSS: A Comprehensive Comparison",
    slug: "css-in-js-vs-tailwind-comparison",
    content_md: "",
    status: "published",
    published_at: "2024-01-07T12:45:00Z",
    updated_at: "2024-01-07T12:45:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    reading_time_ms: 360000, // 6 minutes
    view_count: 523,
    upvote_count: 39,
    comment_count: 6,
    author: mockAuthors[0],
    tags: [mockTags[5], mockTags[6]],
    snippet:
      "Compare different styling approaches for modern web applications and choose the right one for your project.",
  },
];

export const mockSidebarData: SidebarData = {
  trendingTags: mockTags.slice(0, 8),
  recommendedPosts: [
    mockLatestPosts[0],
    mockLatestPosts[2],
    mockLatestPosts[4],
  ],
  categories: [
    { id: "frontend", slug: "frontend", name: "Frontend", post_count: 45 },
    { id: "backend", slug: "backend", name: "Backend", post_count: 32 },
    { id: "devops", slug: "devops", name: "DevOps", post_count: 18 },
    { id: "mobile", slug: "mobile", name: "Mobile", post_count: 12 },
    { id: "ai-ml", slug: "ai-ml", name: "AI & ML", post_count: 15 },
  ],
};

// Mock About page data
export const mockAboutData: AboutPageData = {
  mission:
    "To empower developers and technology enthusiasts by providing high-quality, practical content that bridges the gap between theory and real-world application.",
  vision:
    "Creating a thriving community where developers of all levels can learn, share, and grow together in the ever-evolving world of technology.",
  values: [
    "Quality over quantity - every post is thoroughly researched and tested",
    "Community-driven - our content is shaped by what developers actually need",
    "Open knowledge - making complex concepts accessible to everyone",
    "Continuous learning - staying current with the latest technologies and best practices",
    "Diversity and inclusion - amplifying voices from all backgrounds in tech",
  ],
  team: [
    {
      id: "1",
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer with 8+ years of experience in modern web technologies. Passionate about React, Node.js, and cloud architecture.",
      avatar_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face",
      social_links: {
        twitter: "https://twitter.com/alexchen",
        linkedin: "https://linkedin.com/in/alexchen",
        github: "https://github.com/alexchen",
        website: "https://alexchen.dev",
      },
    },
    {
      id: "2",
      name: "Sarah Kumar",
      role: "Frontend Specialist & UI/UX Lead",
      bio: "Frontend developer and designer who loves creating beautiful, accessible user interfaces. Expert in React, TypeScript, and modern CSS.",
      avatar_url:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face",
      social_links: {
        twitter: "https://twitter.com/sarahkumar",
        linkedin: "https://linkedin.com/in/sarahkumar",
        github: "https://github.com/sarahkumar",
      },
    },
    {
      id: "3",
      name: "Marcus Johnson",
      role: "DevOps Engineer & Cloud Architect",
      bio: "Infrastructure and cloud specialist with expertise in AWS, Docker, and Kubernetes. Loves automating everything and optimizing performance.",
      avatar_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face",
      social_links: {
        linkedin: "https://linkedin.com/in/marcusjohnson",
        github: "https://github.com/marcusjohnson",
      },
    },
    {
      id: "4",
      name: "Dr. Priya Patel",
      role: "AI/ML Research Lead",
      bio: "Machine Learning researcher and data scientist with a PhD in Computer Science. Specializes in making AI concepts accessible to developers.",
      avatar_url:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=face",
      social_links: {
        twitter: "https://twitter.com/drpriyapatel",
        linkedin: "https://linkedin.com/in/priyapatel",
      },
    },
    {
      id: "5",
      name: "James Rodriguez",
      role: "Mobile Development Expert",
      bio: "Cross-platform mobile developer with expertise in React Native, Flutter, and native iOS/Android development.",
      avatar_url:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop&crop=face",
      social_links: {
        twitter: "https://twitter.com/jamesrod",
        github: "https://github.com/jamesrodriguez",
      },
    },
    {
      id: "6",
      name: "Emily Zhang",
      role: "Content Strategy & Community Manager",
      bio: "Technical writer and community builder who ensures our content meets the needs of our diverse developer audience.",
      avatar_url:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=256&h=256&fit=crop&crop=face",
      social_links: {
        twitter: "https://twitter.com/emilyzhang",
        linkedin: "https://linkedin.com/in/emilyzhang",
      },
    },
  ],
  contact: {
    email: "hello@technoblog.dev",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    phone: "+1 (555) 123-TECH",
  },
  stats: {
    posts_published: 420,
    authors: 25,
    readers: 50000,
    years_active: 3,
  },
};

// Mock categories for posts page
export const mockCategories: Category[] = [
  {
    id: "frontend",
    slug: "frontend",
    name: "Frontend Development",
    description: "React, Vue, Angular, and modern frontend technologies",
    post_count: 45,
    color: "#3B82F6",
    icon: "Layout",
  },
  {
    id: "backend",
    slug: "backend",
    name: "Backend Development",
    description: "Node.js, Python, databases, and server-side technologies",
    post_count: 32,
    color: "#10B981",
    icon: "Server",
  },
  {
    id: "devops",
    slug: "devops",
    name: "DevOps & Cloud",
    description: "Docker, Kubernetes, AWS, CI/CD, and infrastructure",
    post_count: 18,
    color: "#F59E0B",
    icon: "Cloud",
  },
  {
    id: "mobile",
    slug: "mobile",
    name: "Mobile Development",
    description: "React Native, Flutter, iOS, and Android development",
    post_count: 12,
    color: "#8B5CF6",
    icon: "Smartphone",
  },
  {
    id: "ai-ml",
    slug: "ai-ml",
    name: "AI & Machine Learning",
    description: "Artificial intelligence, ML algorithms, and data science",
    post_count: 15,
    color: "#EF4444",
    icon: "Brain",
  },
  {
    id: "web3",
    slug: "web3",
    name: "Web3 & Blockchain",
    description: "Cryptocurrency, DeFi, smart contracts, and blockchain tech",
    post_count: 8,
    color: "#06B6D4",
    icon: "Coins",
  },
];

// Extended posts for posts page
export const mockAllPosts: Post[] = [
  ...mockFeaturedPosts,
  ...mockLatestPosts,
  // Additional posts for comprehensive grid
  {
    id: "additional-1",
    author_id: "3",
    title: "Container Orchestration with Kubernetes: A Complete Guide",
    slug: "kubernetes-container-orchestration-guide",
    content_md: "",
    status: "published",
    published_at: "2024-01-13T16:00:00Z",
    updated_at: "2024-01-13T16:00:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
    reading_time_ms: 720000, // 12 minutes
    view_count: 2100,
    upvote_count: 156,
    comment_count: 28,
    author: mockAuthors[2],
    tags: [mockTags[7], mockTags[8]],
    snippet:
      "Master Kubernetes from basics to advanced concepts. Learn how to deploy, scale, and manage containerized applications in production environments.",
  },
  {
    id: "additional-2",
    author_id: "4",
    title: "Introduction to Machine Learning with Python and Scikit-learn",
    slug: "machine-learning-python-scikit-learn",
    content_md: "",
    status: "published",
    published_at: "2024-01-12T11:30:00Z",
    updated_at: "2024-01-12T11:30:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop",
    reading_time_ms: 600000, // 10 minutes
    view_count: 1840,
    upvote_count: 134,
    comment_count: 22,
    author: mockAuthors[3],
    tags: [
      mockTags[9],
      {
        id: "ml",
        slug: "machine-learning",
        name: "Machine Learning",
        post_count: 15,
      },
    ],
    snippet:
      "Get started with machine learning using Python. This comprehensive guide covers fundamental concepts, algorithms, and practical implementations.",
  },
  {
    id: "additional-3",
    author_id: "1",
    title: "Building Real-time Applications with WebSockets and Socket.io",
    slug: "realtime-websockets-socketio",
    content_md: "",
    status: "published",
    published_at: "2024-01-11T09:15:00Z",
    updated_at: "2024-01-11T09:15:00Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    reading_time_ms: 540000, // 9 minutes
    view_count: 1620,
    upvote_count: 98,
    comment_count: 15,
    author: mockAuthors[0],
    tags: [mockTags[3], mockTags[4]],
    snippet:
      "Learn how to build real-time features like chat applications, live notifications, and collaborative tools using WebSockets and Socket.io.",
  },
];

// Posts page data
export const mockPostsPageData: PostsPageData = {
  posts: mockAllPosts,
  categories: mockCategories,
  popularTags: mockTags.slice(0, 10),
  totalCount: mockAllPosts.length,
};

// Detailed post content for post details page
const samplePostContent = `
# Building Scalable Applications with Next.js 15 and Server Components

Next.js 15 introduces powerful new features that make building scalable applications easier than ever. In this comprehensive guide, we'll explore how to leverage Server Components, the new App Router, and advanced caching strategies to create high-performance web applications.

## Table of Contents

1. [Introduction to Server Components](#introduction)
2. [Setting up Next.js 15](#setup)
3. [Building Your First Server Component](#first-component)
4. [Advanced Patterns](#advanced-patterns)
5. [Performance Optimization](#performance)

## Introduction to Server Components {#introduction}

Server Components represent a paradigm shift in how we think about React applications. Unlike traditional client-side rendering, Server Components are rendered on the server and sent to the client as HTML.

### Key Benefits

- **Reduced Bundle Size**: Server Components don't add to your JavaScript bundle
- **Direct Database Access**: Query your database directly without APIs
- **Improved SEO**: Content is available immediately for search engines
- **Better Performance**: Faster initial page loads and better Core Web Vitals

## Setting up Next.js 15 {#setup}

Let's start by creating a new Next.js 15 project with the latest features enabled:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm install
\`\`\`

### Project Structure

Here's the recommended project structure for a scalable Next.js 15 application:

\`\`\`javascript
// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav>Navigation</nav>
        </header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}
\`\`\`

## Building Your First Server Component {#first-component}

Server Components are the default in the App Router. Here's a simple example:

\`\`\`tsx
// app/posts/page.tsx
import { getPosts } from '@/lib/db'

export default async function PostsPage() {
  // This runs on the server
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

### Data Fetching Patterns

Next.js 15 provides several patterns for data fetching:

\`\`\`typescript
// Fetch data in Server Components
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    // Enable caching
    next: { revalidate: 3600 }
  })
  
  return <div>{/* Render data */}</div>
}
\`\`\`

## Advanced Patterns {#advanced-patterns}

### Streaming with Suspense

Use React Suspense to stream content as it becomes available:

\`\`\`tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments />
      </Suspense>
    </div>
  )
}
\`\`\`

### Error Boundaries

Handle errors gracefully with error boundaries:

\`\`\`tsx
// app/posts/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}
\`\`\`

## Performance Optimization {#performance}

### Caching Strategies

Next.js 15 provides multiple caching layers:

1. **Router Cache**: Client-side navigation cache
2. **Full Route Cache**: Server-side route caching
3. **Data Cache**: Fetch request caching
4. **Request Memoization**: Deduplication within a request

### Example: Optimized Data Fetching

\`\`\`typescript
import { cache } from 'react'

// Memoize expensive operations
const getUser = cache(async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    include: { posts: true }
  })
  return user
})

export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <div>Posts: {user.posts.length}</div>
    </div>
  )
}
\`\`\`

## Video Content

Let's also look at a practical example. Here's a video walkthrough of building a Next.js application:

<video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls>
  Your browser does not support the video tag.
</video>

## Conclusion

Next.js 15 with Server Components provides a powerful foundation for building scalable applications. The combination of server-side rendering, efficient caching, and modern React patterns enables developers to create fast, SEO-friendly applications with excellent user experience.

Key takeaways:
- Server Components reduce bundle size and improve performance
- The App Router provides better developer experience and routing capabilities
- Proper caching strategies are crucial for production applications
- Streaming and Suspense enable better user experience during loading

Ready to start building? Check out the [official Next.js documentation](https://nextjs.org/docs) for more detailed guides and examples.
`;

// Mock comments
const mockComments: Comment[] = [
  {
    id: "comment-1",
    post_id: "1",
    author_id: "2",
    body: "Excellent article! The section on Server Components really helped me understand the benefits. I've been struggling with bundle size in my current React app, and this looks like exactly what I need.",
    created_at: "2024-01-15T12:30:00Z",
    status: "approved",
    author: mockAuthors[1],
    replies: [
      {
        id: "comment-2",
        post_id: "1",
        author_id: "1",
        parent_id: "comment-1",
        body: "Thanks Sarah! I'm glad it was helpful. Server Components are definitely a game-changer for performance. If you have any specific questions about implementation, feel free to ask!",
        created_at: "2024-01-15T13:15:00Z",
        status: "approved",
        author: mockAuthors[0],
      },
      {
        id: "comment-3",
        post_id: "1",
        author_id: "3",
        parent_id: "comment-1",
        body: "I second this! We migrated our dashboard to Next.js 15 and saw a 40% improvement in initial load times. The caching strategies mentioned here are spot on.",
        created_at: "2024-01-15T14:20:00Z",
        status: "approved",
        author: mockAuthors[2],
      },
    ],
  },
  {
    id: "comment-4",
    post_id: "1",
    author_id: "4",
    body: "Great walkthrough of the new features. One question though - how does this affect SEO compared to traditional SSR approaches? Are there any gotchas we should be aware of?",
    created_at: "2024-01-15T16:45:00Z",
    status: "approved",
    author: mockAuthors[3],
    replies: [
      {
        id: "comment-5",
        post_id: "1",
        author_id: "1",
        parent_id: "comment-4",
        body: "Excellent question, Lisa! Server Components actually improve SEO significantly since the content is fully rendered on the server. Search engines can crawl the complete HTML immediately. I'll consider writing a follow-up article specifically about SEO best practices with Next.js 15.",
        created_at: "2024-01-15T17:30:00Z",
        status: "approved",
        author: mockAuthors[0],
      },
    ],
  },
  {
    id: "comment-6",
    post_id: "1",
    author_id: "2",
    body: "The code examples are really clear and practical. I especially appreciate the error boundary example - that's something I always forget to implement properly. Bookmarking this for reference!",
    created_at: "2024-01-16T09:15:00Z",
    status: "approved",
    author: mockAuthors[1],
  },
];

// Extended post with full content
export const mockDetailedPost: Post = {
  ...mockFeaturedPosts[0],
  content_md: samplePostContent,
  content_mdx: samplePostContent,
};

// Mock post details data
export const mockPostDetailsData: PostDetailsData = {
  post: mockDetailedPost,
  relatedPosts: [mockLatestPosts[0], mockLatestPosts[1], mockLatestPosts[2]],
  comments: mockComments,
};
