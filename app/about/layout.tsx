import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | TechnoBlog",
  description:
    "Learn about TechnoBlog's mission, vision, and the passionate team behind our technical content. Discover our values and get in touch with us.",
  keywords: ["about", "team", "mission", "vision", "contact", "technoblog"],
  openGraph: {
    title: "About Us | TechnoBlog",
    description:
      "Learn about TechnoBlog's mission, vision, and the passionate team behind our technical content.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
