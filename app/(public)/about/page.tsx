import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TeamMember } from "@/types";

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Image
            src={member.avatar_url}
            alt={member.name}
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
        <CardTitle className="text-xl">{member.name}</CardTitle>
        <Badge variant="secondary" className="mx-auto">
          {member.role}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{member.bio}</p>
        {member.social_links && (
          <div className="flex justify-center gap-2">
            {member.social_links.twitter && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={member.social_links.twitter} target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {member.social_links.linkedin && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={member.social_links.linkedin} target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {member.social_links.github && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={member.social_links.github} target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {member.social_links.website && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={member.social_links.website} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatsCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary mb-2">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

export default function AboutPage() {
  // Static about data
  const aboutData = {
    mission:
      "Empowering developers and technology enthusiasts with cutting-edge insights, practical tutorials, and in-depth analysis of the latest trends in software development, AI, and emerging technologies.",
    vision:
      "To become the leading platform where developers discover, learn, and share knowledge that shapes the future of technology.",
    values: [
      {
        title: "Quality First",
        description:
          "We prioritize high-quality, well-researched content that provides real value to our readers.",
      },
      {
        title: "Community Driven",
        description:
          "Our platform thrives on community contributions and collaborative learning.",
      },
      {
        title: "Innovation Focus",
        description:
          "We stay ahead of the curve, covering emerging technologies and innovative solutions.",
      },
      {
        title: "Practical Learning",
        description:
          "Every article includes practical examples and actionable insights you can apply immediately.",
      },
    ],
    team: [
      {
        id: "1",
        name: "Alex Chen",
        role: "Lead Developer & Founder",
        bio: "Full-stack developer with 8+ years of experience in React, Node.js, and cloud architecture.",
        avatar_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        social_links: {
          twitter: "https://twitter.com/alexchen",
          linkedin: "https://linkedin.com/in/alexchen",
          github: "https://github.com/alexchen",
        },
      },
      {
        id: "2",
        name: "Sarah Johnson",
        role: "AI/ML Specialist",
        bio: "Data scientist and machine learning engineer passionate about democratizing AI knowledge.",
        avatar_url:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
        social_links: {
          twitter: "https://twitter.com/sarahjohnson",
          linkedin: "https://linkedin.com/in/sarahjohnson",
          website: "https://sarahjohnson.dev",
        },
      },
    ],
    contact: {
      email: "hello@technoblog.dev",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, Silicon Valley, CA 94000",
    },
    stats: {
      posts_published: 150,
      authors: 12,
      readers: 50000,
      years_active: 3,
    },
  };

  const { mission, vision, values, team, contact, stats } = aboutData;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About TechnoBlog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {mission}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <StatsCard
          label="Posts Published"
          value={stats.posts_published.toLocaleString()}
        />
        <StatsCard label="Expert Authors" value={stats.authors} />
        <StatsCard
          label="Monthly Readers"
          value={`${(stats.readers / 1000).toFixed(0)}K+`}
        />
        <StatsCard label="Years Active" value={stats.years_active} />
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{mission}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{vision}</p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      <Separator className="mb-16" />

      {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <Mail className="h-8 w-8 text-primary mb-2" />
            <p className="font-medium">Email</p>
            <Link
              href={`mailto:${contact.email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {contact.email}
            </Link>
          </div>

          {contact.phone && (
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Phone</p>
              <Link
                href={`tel:${contact.phone}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {contact.phone}
              </Link>
            </div>
          )}

          {contact.address && (
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground text-center">
                {contact.address}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href={`mailto:${contact.email}`}>Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
