'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, User, Tv, Film, Home, LogOut, Menu } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse', icon: Film },
  { href: '/browse?type=movie', label: 'Movies', icon: Film },
  { href: '/browse?type=tv', label: 'TV Shows', icon: Tv },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const typeParam = searchParams.get('type');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      // Close sheet if it's open on mobile
      const closeButton = document.getElementById('mobile-menu-close');
      if (closeButton) closeButton.click();
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  const NavLink = ({ href, label }: { href: string, label: string }) => {
    const isActive = (() => {
      if (href.includes('?')) {
        const linkParams = new URLSearchParams(href.split('?')[1]);
        const linkType = linkParams.get('type');
        return pathname === '/browse' && typeParam === linkType;
      }
      if (href === '/browse') {
        return pathname === '/browse' && !typeParam;
      }
      return pathname === href;
    })();

    return (
       <Link
          href={href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            isActive ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {label}
        </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Entertainment-Kit</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-6">
            {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-4">
          <form onSubmit={handleSearch} className="relative hidden w-full max-w-xs sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search..."
              className="pl-9"
              aria-label="Search"
            />
          </form>
          {isUserLoading ? (
            <div className="h-10 w-10" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/watchlist')}>Watchlist</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => router.push('/login')} className="hidden sm:inline-flex">
              Login
            </Button>
          )}

           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetClose id="mobile-menu-close" className="hidden" />
                <div className="flex flex-col gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <Logo className="h-6 w-6 text-primary" />
                        <span className="font-bold">Entertainment-Kit</span>
                    </Link>
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="search"
                          placeholder="Search..."
                          className="pl-9"
                          aria-label="Search"
                        />
                    </form>
                    <nav className="flex flex-col gap-4 text-lg">
                        {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
                    </nav>
                     {!user && (
                        <Button variant="outline" onClick={() => router.push('/login')}>
                            Login
                        </Button>
                    )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
