import MainNav from './main-nav';
import { MobileNav } from './mobile-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MainNav />
      <MobileNav />
    </header>
  );
}
