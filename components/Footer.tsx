import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui";

const footerLinks = {
  main: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  resources: [
    { label: "RSS Feed", href: "/rss.xml" },
    { label: "Sitemap", href: "/sitemap.xml" },
    { label: "Authors", href: "/authors" },
    { label: "Tags", href: "/tags" },
  ],
};

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:contact@technoblog.com",
    icon: Mail,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    icon: Rss,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  TB
                </span>
              </div>
              <span className="font-bold text-xl">TechnoBlog</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              A developer-focused platform for sharing technical knowledge,
              implementation guides, and industry insights.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                    target={social.href.startsWith("http") ? "_blank" : "_self"}
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © {currentYear} TechnoBlog. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
