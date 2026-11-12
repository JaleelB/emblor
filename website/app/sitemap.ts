import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site-config';
import { source } from '@/lib/source';

const routes = ['/', ...source.getPages().map((page) => page.url), '/playground'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}
