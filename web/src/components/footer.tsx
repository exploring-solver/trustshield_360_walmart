import { Wand2 } from "lucide-react";
import Link from "next/link"; 

export function Footer() {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">ShopLifters</span>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <Link
              href="https://github.com/exploring-solver/walmart "
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </Link>
            <Link
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Twitter
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Powered by Groq AI • © {new Date().getFullYear()} VideoTransform • Made with ❤️ by ShopLifters
          </div>
        </div>
      </div>
    </footer>
  );
} 