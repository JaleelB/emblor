import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.28 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.79.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.27-8.31L3 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.73L8.46 4.05H6.61L17.8 19.84Z" />
    </svg>
  );
}

export function NpmIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0 7.33v8h6.67v1.34H12v-1.34h12v-8H0Zm6.67 6.67H5.33V9.67h1.34V14Zm5.33 0h-1.33V9.67H12V14Zm6.67 0H16V9.67h2.67V14Z" />
    </svg>
  );
}
