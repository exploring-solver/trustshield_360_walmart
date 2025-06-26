'use client';

import { usePathname } from 'next/navigation';
import {Nav} from "@/components/nav";
import {Footer} from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = ['/sign-in', '/sign-up',].includes(pathname);
  const hideFoot = ['/sign-in', '/sign-up',].includes(pathname);

  return (
    <>
      {!hideNav && <Nav />}
      {children}
      {!hideFoot && <Footer/>}
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ClientLayout>
          {children}
          <Toaster />
        </ClientLayout>
      </ThemeProvider>
  );
}

//Not in use