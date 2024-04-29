export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
};

export const siteConfig: SiteConfig = {
  name: 'Emblor',
  description: `A highly customizable, accessible, and fully-featured tag input component built with Shadcn UI.`,
  url: 'https://emblor.jaleelbennett.com',
  links: {
    twitter: 'https://twitter.com/jal_eelll',
    github: 'https://github.com/JaleelB/emblor',
  },
};
