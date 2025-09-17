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
import { mockAboutData } from "@/lib";
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
  const { mission, vision, values, team, contact, stats } = mockAboutData;

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
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">{value}</p>
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
