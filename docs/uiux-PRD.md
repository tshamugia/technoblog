# Blog Application UI PRD (UI-Focused)

Last updated: 2025-09-16

This document specifies UI styling, components, icons, images, and interaction patterns only. Backend behavior and data rules are defined in PRD.md and tech-PDR.md.

---

## 1. Design System (Tokens)

- Colors
	- Background: light gray-50 background; card surfaces white; dark mode uses slate/neutral.
	- Primary: brand indigo/blue; Secondary: slate; Accent: emerald (success), amber (warning), rose (error).
	- Text: high-contrast defaults; muted foreground for meta.
- Typography
	- Headings: Inter/SF; Body: Inter; Mono: JetBrains Mono/Fira Code for code blocks.
	- Scale: `text-xs/sm/base/lg/xl/2xl/3xl` with responsive steps.
- Spacing & Radius
	- 4pt grid; radii: `sm (4px)`, `md (8px)`, `lg (12px)`, `full` for pills/avatars.
- Elevation
	- Subtle shadows for cards; strong focus rings (`ring-2 ring-offset-2`).
- States
	- Hover, active, focus-visible, disabled; loading skeletons included.
- Dark Mode
	- Honor system preference; toggle in header; persist preference.

Implementation: Tailwind theme extension + shadcn/ui tokens.

---

## 2. Component Library Map (shadcn/ui)

- Primitives: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Label, Badge, Avatar, Tooltip, Dialog, Drawer, Popover, Tabs, Accordion, Toast, DropdownMenu, Separator, Skeleton, ScrollArea.
- Layout: Container, Grid, Card, Sheet, Breadcrumbs, Pagination.
- Content: Prose styles for Markdown, Code block with copy button, Image (next/image), Video player (Mux/embed), Tag chip, Post card, Comment item, Empty state.
- Navigation: Header, Footer, Navbar menu, Sidebar (admin/dashboard), Search bar, Command palette (optional).
- Feedback: Spinner, Progress, Alert, Inline validation (error/success), Toaster.

Icon set: Lucide (default in shadcn). Add brand icons (GitHub, X/Twitter, YouTube) via SVGs in `public/`.

---

## 3. Page Compositions (UI-only)

### 3.1 Homepage
- Header with nav (Home, Categories, About, News blog, Login/Register)
- Featured grid (or carousel) of 3–6 posts
- Latest posts list (cards): title, snippet, author avatar/name, date, tags
- Sidebar (lg+): Trending tags (Badges), Recommended posts
- Footer

### 3.2 Post Page
- Title, meta (author avatar/name, publish date, read time, tags)
- Content area (prose styles), code blocks with copy button, images with captions, embedded videos
- Share buttons (X/Twitter, LinkedIn, Copy link)
- Reactions (Upvote/Like) and view count
- Comments section (threaded): input, list, pagination/load more
- Recommended/Related posts

### 3.3 Tags Page
- Tag header (name, description, cover optional)
- Posts grid/list for the tag with pagination
- Related tags section

### 3.4 Search Page
- Search input (debounced); filters: tag, author, date range
- Results list as cards; empty/search tips state
- Pagination

### 3.5 Login/Register
- Auth card with tabs (Login | Register)
- Email/password inputs; forgot password link
- Social buttons (optional placeholders)
- Inline validation and error summary

### 3.6 About
- Static content layout: team grid (avatars), contact links, brand values

### 3.7 Dashboard (User)
- Header with quick actions (New Post)
- Cards: Stats (views, upvotes), Drafts, Published
- Table/List of posts with status badges and actions (edit/delete)
- Notifications list

### 3.8 Create/Edit Post
- Title input, Slug (readonly auto), Tags selector (pills)
- Editor: MDX editor area with toolbar (bold, italic, code, quote, list, link, image/video embed)
- Preview tab (side-by-side on lg+)
- Actions: Save draft, Publish, Discard; status/toast feedback

### 3.9 Profile
- Avatar upload/crop, display name, bio, social links
- List of user posts (tabs: Published | Drafts | Archived)

### 3.10 Admin
- Overview: KPI cards, recent activity
- Users: searchable table, row actions (view/suspend)
- Posts: searchable table, filters (status/tag), row actions (approve/reject/delete)
- Reports: list of flagged items, details drawer, action buttons

---

## 4. Interaction Patterns

- Navigation: Persistent header; hamburger → Drawer on mobile; breadcrumbs on deep pages.
- Search: Debounce 300ms; show spinner; keyboard shortcut `/` to focus.
- Forms: Inline validation on blur; disable submit when invalid; field-level + form-level errors.
- Feedback: Skeletons for lists/cards; optimistic UI for likes; toasts for success/errors.
- Comments: Collapse long threads; lazy-load more replies; markdown-lite in comments.
- Keyboard: `k` to open command palette (optional), `Esc` to close dialogs/drawers.

---

## 5. Assets (Icons/Images/Illustrations)

- Icons: Lucide via `lucide-react`; sizes 16/20/24 px with consistent stroke.
- Logos: SVG in `public/` for brand + wordmark; dark/light variants.
- Illustrations/Placeholders: Empty states (e.g., Inbox zero), 404; store SVGs in `public/illustrations/`.
- OG Images: Template for dynamic OG cards (title, author, tag) using Vercel OG.
- Favicons: 16/32/64 + maskable PWA icon.

---

## 6. Accessibility & Theming

- Accessibility (WCAG AA)
	- Color contrast AA; focus-visible rings; skip-to-content link.
	- Labels and aria-* on inputs; semantic landmarks.
	- Keyboard navigability for menus, dialogs, drawers.
- Theming
	- Light/Dark; store preference; honor OS setting.
	- High-contrast theme (optional later).

---

## 7. Component Inventory per Page

- Homepage: Header, Tag chips, PostCard, Pagination, Sidebar widgets, Footer.
- Post: ArticleHeader, ProseContent, CodeBlock, Tag chips, ShareButtons, Reactions, Comments, RelatedPosts.
- Tags: TagHeader, PostCardGrid, Pagination.
- Search: SearchInput, Filters (Select/Checkbox), PostCardList, EmptyState, Pagination.
- Auth: AuthCard (Tabs, Inputs, Buttons), Alert, SocialButtons.
- Dashboard: StatCard, PostTable, Badge, Tabs, Toast, Pagination.
- Editor: EditorToolbar, MDXEditor, TagSelector, PreviewPane, ActionBar.
- Profile: AvatarUploader, ProfileForm, SocialLinks, PostList.
- Admin: DataTable, Filters, RowActions, Drawer, AlertDialog, Breadcrumbs.

---

## 8. QA Checklist (UI)

- Layout: Responsive at breakpoints (sm, md, lg, xl)
- States: hover, active, focus-visible, disabled, loading
- Empty/Error States: present and informative
- Performance: image sizes responsive; avoid layout shift; skeletons present
- A11y: semantic HTML, landmarks, labels; tab order logical; screen reader checks

---

## 9. Open Questions (UI)

- Featured carousel vs. featured grid?
- Command palette: MVP or later?
- Editor: custom MDX editor vs. headless editor + MDX serialization?

# Blog Application UI PRD (Product Requirements Document)

## 1. Overview

**Purpose:**
Define all UI/UX requirements for the technical blog application, covering public-facing pages, authenticated user pages, and admin dashboard.

**Target Users:**

* Public readers
* Registered users (authors, commenters)
* Admins

**Design Principles:**

* Responsive design (desktop, tablet, mobile)
* User-friendly, accessible, and clean interface
* Consistent visual language and color palette
* Intuitive navigation and content discovery

**Validation:**

* All forms validated using ZOD (server-side validation)
* Real-time feedback for invalid inputs where applicable

---

## 2. Public-Facing Pages

### 2.1 Homepage

**Purpose:** Showcase latest posts and popular topics.
**Components:**

* Header with navigation (Home, Categories, About, Login/Register)
* Featured posts carousel
* Latest posts list with preview cards (title, snippet, tags, author, date)
* Sidebar: Trending tags, recommended posts
* Footer: About, Contact, Social links

### 2.2 Post Page

**Purpose:** Display full post content.
**Components:**

* Post title, author, publish date
* Content: Text, images, videos
* Tags list
* Like button and comment section
* Share buttons
* Recommended posts at the end

### 2.3 Categories/Tags Page

**Purpose:** Allow browsing by tags or categories.
**Components:**

* Tag list or category filter
* Grid/List of posts matching the selected tag/category

### 2.4 Search Page

**Purpose:** Enable search for posts.
**Components:**

* Search bar (autocomplete optional)
* Filter by tags or date
* Results list with pagination

### 2.5 Login/Register Page

**Purpose:** User authentication.
**Components:**

* Email & password fields
* Social login buttons (optional)
* Validation messages (ZOD)
* Password reset link

### 2.6 About Page

**Purpose:** Inform about blog purpose and team.
**Components:**

* Static content
* Contact information
* Optional team bios

---

## 3. Authenticated User Pages

### 3.1 User Dashboard

**Purpose:** Central hub for user activities.
**Components:**

* Profile summary (avatar, bio, stats)
* List of user's posts (drafts, published, archived)
* Create new post button
* Notifications for comments, likes

### 3.2 Create/Edit Post Page

**Purpose:** Allow users to create or edit posts.
**Components:**

* Title input
* Rich text editor (support images, videos, code snippets)
* Tags input
* Save as draft / Publish buttons
* Validation feedback

### 3.3 User Profile Page

**Purpose:** Display user info and activity.
**Components:**

* Avatar, bio, social links
* List of user's posts
* Likes and comments activity

### 3.4 Comments & Likes

**Purpose:** Enable engagement.
**Components:**

* Comment input with submit button
* Like/Dislike buttons for comments
* Nested replies

---

## 4. Admin Dashboard

### 4.1 Admin Home

**Purpose:** Overview of platform activity.
**Components:**

* Total users, posts, comments stats
* Recent activity feed

### 4.2 Manage Users

**Components:**

* Users list with search/filter
* View detailed user info
* Suspend/Delete users

### 4.3 Manage Posts

**Components:**

* Posts list with search/filter
* Approve/Reject posts (if moderation required)
* Delete or edit posts

### 4.4 Reported Content

**Components:**

* List of reported posts/comments
* Actions: Review, Approve, Delete

---

## 5. UI/UX Considerations

* **Responsive Design:** Use CSS Grid and Flexbox, ensure all pages render well on mobile, tablet, and desktop.
* **Color Palette:** Soft, readable colors; high contrast for accessibility.
* **Typography:** Clear hierarchy for headings, subheadings, body text.
* **Navigation:** Persistent header and footer, breadcrumbs for deep navigation.
* **Feedback:** Loading indicators, success/error messages, empty states.
* **Accessibility:** Keyboard navigation, ARIA labels, color contrast standards.

---

## 6. Technical Considerations

* **Frontend Stack:** Next.js, Tailwind CSS, ShadCN UI components.
* **Form Validation:** ZOD, server-side.
* **State Management:** Prefer server components and React Query or Zustand for client state.
* **Media Handling:** Support image/video upload in posts.
* **SEO:** SSR/SSG where possible for posts.

---

## 7. Page Flow Summary

1. **Public User:** Homepage → Post Page → Login/Register (optional) → Comment/Like
2. **Authenticated User:** Dashboard → Create/Edit Post → Post Page → Comment/Like → Profile
3. **Admin:** Admin Home → Manage Users/Posts → Review Reported Content

---
