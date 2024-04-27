import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

type ExtendedCSSProperties = React.CSSProperties & {
  [key: string]: string | number;
};

const defaultStyle: ExtendedCSSProperties = {
  "--input-height": "40px",
  "--input-width": "100%",
  "--border-radius": "0.375rem",
  "--padding-horizontal": "0.75rem",
  "--padding-vertical": "0.5rem",
  "--font-size": "0.875rem",
  "--outline-offset": "2px",
  "--cursor": "text",
  "--opacity": "1",
  display: "flex",
  height: "var(--input-height)",
  width: "var(--input-width)",
  borderRadius: "var(--border-radius)",
  paddingLeft: "var(--padding-horizontal)",
  paddingRight: "var(--padding-horizontal)",
  paddingTop: "var(--padding-vertical)",
  paddingBottom: "var(--padding-vertical)",
  fontSize: "var(--font-size)",
  cursor: "var(--cursor)",
  opacity: "var(--opacity)",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return <input type={type} className={className} ref={ref} {...props} />;
  },
);
Input.displayName = "Input";

export { Input };
