export type SiteConfig = {
    name: string
    description: string
    url: string
    links: {
      twitter: string
      github: string
    }
}

export const siteConfig: SiteConfig = {
  name: "Shadcn Tag Input",
  description:
    "A tag input component implementation of Shadcn's input component",
  url: "https://shadcn-tag-input.vercel.app",
  links: {
    twitter: "https://twitter.com/jal_eelll",
    github: "https://github.com/JaleelB/shadcn-tag-input",
  },
}