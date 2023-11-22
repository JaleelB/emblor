import { cn } from "@/lib/utils";
import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";
import CopyButton from "./copy-button";

function CodeBlock({
  value,
  className,
  copyable = true,
}: {
  value: string;
  className?: string;
  codeClass?: string;
  copyable?: boolean;
  codeWrap?: boolean;
  noCodeFont?: boolean;
  noMask?: boolean;
}) {
  value = value || "";
  const { theme } = useTheme();

  const themeToggle = () => {
    if (theme?.includes("dark")) {
      return themes.nightOwl;
    } else {
      return themes.oneDark;
    }
  };

  return (
    <Highlight theme={themeToggle()} code={value} language="tsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={style}
          className={cn(
            `relative h-full w-full whitespace-pre-wrap rounded-lg p-4 text-sm
          } `,
            className
          )}
        >
          <CopyButton value={value} copyable={copyable} />

          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="mr-6">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default CodeBlock;
