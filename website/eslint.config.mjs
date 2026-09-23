import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ['.next/**', 'public/_pagefind/**', 'node_modules/**'],
  },
];

export default eslintConfig;
