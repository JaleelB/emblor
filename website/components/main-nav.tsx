import { cn } from '../lib/utils';
import { buttonVariants } from './ui/button';
import { Icons } from './icons';
import { siteConfig } from '@/config/site-config';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';

export default function MainNav() {
  return (
    <div className="container h-14 max-w-screen-2xl items-center hidden md:flex">
      <div className="flex flex-1 items-center justify-between space-x-2">
        <Link href="/">
          <div
            className={cn(
              buttonVariants({
                variant: 'link',
              }),
              'px-0',
            )}
          >
            <Icons.logo className="mr-2 h-6" />
            <span className="sr-only">Home link</span>
          </div>
        </Link>
        <nav className="flex items-center">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                }),
                'w-9 px-0',
              )}
            >
              <Icons.gitHub className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                }),
                'w-9 px-0',
              )}
            >
              <Icons.twitter className="h-3 w-3 fill-current" />
              <span className="sr-only">Twitter</span>
            </div>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </div>
  );
}
