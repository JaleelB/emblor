import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { js } from 'js-beautify';

export function formatJavaScriptCode(codeString: string) {
  const options = {
    indent_size: 2,
    space_in_empty_paren: true,
    eol: '\n',
    end_with_newline: true,
    preserve_newlines: true,
    break_chained_methods: false,
    max_preserve_newlines: 2,
    jslint_happy: false,
    keep_array_indentation: true,
    keep_function_indentation: true,
    space_before_conditional: true,
    unescape_strings: false,
    wrap_line_length: 0,
    space_after_anon_function: true,
  };

  return js(codeString, options);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString();
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
