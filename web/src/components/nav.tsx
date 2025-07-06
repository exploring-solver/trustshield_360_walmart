'use client'; 
import Link from "next/link";
import { 
  Wand2, 
  ArrowRight, 
  Menu, 
  X, 
  Eye, 
  Blocks, 
  Shield, 
  ShoppingCart, 
  Settings, 
  Wallet,
  Database,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trustShieldRoutes = [
    {
      name: "Checkout Demo",
      href: "/checkout",
      icon: ShoppingCart,
      description: "Secure payment flow demo"
    },
    {
      name: "Admin Dashboard", 
      href: "/admin-dashboard",
      icon: Settings,
      description: "Real-time security monitoring"
    },
    {
      name: "Blockchain Explorer",
      href: "/explorer", 
      icon: Database,
      description: "Transaction ledger explorer"
    },
    {
      name: "Digital Wallet",
      href: "/wallet",
      icon: Wallet,
      description: "Verifiable credentials wallet"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TrustShield 360</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedIn>
            {/* Legacy Routes */}
            <Link href="/visualization">
              <Button variant="outline" size="sm" className="hidden lg:flex gap-2">
                <Eye className="h-4 w-4" />
                Visualizer
              </Button>
            </Link>
            <Link href="/secure-flow">
              <Button variant="outline" size="sm" className="hidden lg:flex gap-2">
                <Blocks className="h-4 w-4" />
                BlockChain
              </Button>
            </Link>

            {/* TrustShield Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                  <Shield className="h-4 w-4" />
                  TrustShield 360
                  <Badge variant="secondary" className="ml-1 text-xs">
                    NEW
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  TrustShield 360 Platform
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {trustShieldRoutes.map((route) => (
                  <DropdownMenuItem key={route.href} asChild>
                    <Link href={route.href} className="flex items-start gap-3 p-3">
                      <route.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{route.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {route.description}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 p-3">
                    <Brain className="h-4 w-4" />
                    Legacy Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Get Started Button */}
            <Link href="/checkout">
              <Button size="sm" className="gap-2 hidden sm:flex">
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <UserButton />
            
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="ghost" size="sm">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t py-4 px-6 space-y-4 animate-in slide-in-from-top-10 duration-200">
          <Link
            href="/"
            className="block text-base font-medium hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          <SignedIn>
            {/* Legacy Routes */}
            <Link
              href="/visualization"
              className="block text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Visualizer
            </Link>
            <Link
              href="/secure-flow"
              className="block text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              BlockChain
            </Link>
            <Link
              href="/dashboard"
              className="block text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Legacy Dashboard
            </Link>

            {/* TrustShield Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">TrustShield 360</span>
                <Badge variant="secondary" className="text-xs">NEW</Badge>
              </div>
              
              {trustShieldRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center gap-3 py-2 pl-4 text-sm hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <route.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {route.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <span
                className="block text-base font-medium hover:text-primary cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </span>
            </SignInButton>
            <SignUpButton mode="modal">
              <span
                className="block text-base font-medium hover:text-primary cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </span>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </header>
  );
}