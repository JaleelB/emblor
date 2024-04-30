import { type MetadataRoute } from 'next';
import { siteConfig } from '../config/site-config';
import { docsConfig } from '@/config/docs-config';

const siteUrls = docsConfig.sidebarNav.reduce((acc: MetadataRoute.Sitemap, section) => {
  section.items.forEach((item) => {
    const href = item.href === '/' ? '/introduction' : item.href;
    acc.push({
      url: `${siteConfig.url}${href}`,
      lastModified: new Date(),
    });
  });
  return acc;
}, []);

export default function sitemap(): MetadataRoute.Sitemap {
  return siteUrls;
}
