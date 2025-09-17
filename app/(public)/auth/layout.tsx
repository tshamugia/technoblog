import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TechnoBlog</h1>
          <p className="text-muted-foreground mt-2">
            Join our community of developers and tech enthusiasts
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardContent className="p-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
