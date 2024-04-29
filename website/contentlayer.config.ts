import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('contentlayer/source-files').ComputedFields} */
export const Docs = defineDocumentType(() => ({
  name: 'Docs',
  filePathPattern: `docs/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Docs],
  mdx: {
    rehypePlugins: [
      [
        rehypePrettyCode as any, // temprorary fix for typescript error. fix later
        {
          keepBackground: false,
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
        },
      ],
    ],
  },
});
