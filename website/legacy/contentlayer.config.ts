import { makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';

import { defineDocumentType } from 'contentlayer/source-files';

export const Snippet = defineDocumentType(() => ({
  name: 'Snippet',
  filePathPattern: `snippets/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    file: {
      type: 'string',
      description: 'The name of the snippet',
      required: true,
    },
    order: {
      type: 'number',
      description: 'The order of the snippet',
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
  //   mdx: {
  //     rehypePlugins: [
  //       [
  //         rehypePrettyCode,
  //         {
  //           keepBackground: false,
  //           theme: {
  //             dark: "github-dark",
  //             light: "github-light",
  //           },
  //         },
  //       ],
  //     ],
  //   },
});
