import { createNextStory } from '@fumadocs/story/next';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();
const withStory = createNextStory();

export default withStory(
  withMDX({
    reactStrictMode: true,
    poweredByHeader: false,
    agentRules: false,
    allowedDevOrigins: ['127.0.0.1', '192.168.1.147'],
    transpilePackages: ['emblor'],
    experimental: {
      optimizePackageImports: ['lucide-react'],
    },
  }),
);
