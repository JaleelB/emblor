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
          href: '/',
          items: [],
        },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        {
          title: 'API Reference',
          href: '/api-reference',
          items: [],
        },
        {
          title: 'Variants',
          href: '/variants',
          items: [],
        },
      ],
    },
    {
      title: 'Integrations',
      items: [
        {
          title: 'With React Hook Form',
          href: '/integrations/react-hook-form',
          items: [],
        },
        {
          title: 'With Shadcn Form',
          href: '/integrations/shadcn-form',
          items: [],
        },
      ],
    },
  ],
};
