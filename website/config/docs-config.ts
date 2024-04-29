import { SidebarNavItem } from 'types/nav';

interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          items: [],
        },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        {
          title: 'API Reference',
          href: '/docs/api-reference',
          items: [],
        },
        {
          title: 'Variants',
          href: '/docs/variants',
          items: [],
        },
      ],
    },
    {
      title: 'Integrations',
      items: [
        {
          title: 'With React Hook Form',
          href: '/docs/integrations/react-hook-form',
          items: [],
        },
        {
          title: 'With Shadcn Form',
          href: '/docs/integrations/shadcn-form',
          items: [],
        },
      ],
    },
  ],
};
