"use client";

import { LogOut, Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import type { NavigationItem } from "@/types";

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog Posts", href: "/posts" },
  { label: "About", href: "/about" },
  { label: "News Blog", href: "/news" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search navigation
      console.log("Searching for:", searchQuery);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // User Avatar Component
  const UserAvatar = () => {
    if (!user) return null;

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image || ""} alt={user.name || "User"} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {user.name ? getInitials(user.name) : "U"}
        </AvatarFallback>
      </Avatar>
    );
  };

  // User Menu Component
  const UserMenu = () => {
    if (!user) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatar />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium text-sm">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              TB
            </span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block text-foreground">
            TechnoBlog
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </form>
        </div>

        {/* Theme Toggle, Auth Buttons & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground/80 hover:text-foreground hover:bg-accent cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`cursor-pointer ${
                    pathname === "/auth/login"
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent"
                  }`}
                  asChild
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`cursor-pointer ${
                    pathname === "/auth/register"
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent"
                  }`}
                  asChild
                >
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground/80 hover:text-foreground hover:bg-accent cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex flex-col space-y-2">
                    {isLoading ? (
                      <div className="h-8 bg-muted animate-pulse rounded" />
                    ) : isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-md bg-muted/50">
                          <UserAvatar />
                          <div className="flex flex-col space-y-1 leading-none">
                            {user?.name && (
                              <p className="font-medium text-sm">{user.name}</p>
                            )}
                            {user?.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="justify-start cursor-pointer text-foreground/80 hover:text-foreground hover:bg-accent"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className={`justify-start cursor-pointer ${
                            pathname === "/auth/login"
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                              : "text-foreground/80 hover:text-foreground hover:bg-accent"
                          }`}
                          asChild
                        >
                          <Link
                            href="/auth/login"
                            className="flex items-center"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Login
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className={`justify-start cursor-pointer ${
                            pathname === "/auth/register"
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                              : "text-foreground/80 hover:text-foreground hover:bg-accent"
                          }`}
                          asChild
                        >
                          <Link href="/auth/register">Register</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden border-t border-border px-4 py-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          />
        </form>
      </div>
    </header>
  );
}
