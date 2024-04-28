import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';

export const Snippet = defineDocumentType(() => ({
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
      resolve: (_) => _._raw.sourceFileName.replace(/\.[^.$]+$/, ''),
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Snippet],
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
