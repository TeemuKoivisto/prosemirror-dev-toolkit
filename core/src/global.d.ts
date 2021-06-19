declare global {
  interface Window {
    requestIdleCallback?: (callback: (time: number) => void) => void
    cancelIdleCallback?: (callback: (time: number) => void) => void
  }
}

declare module 'html' {
  // indent_size (default 4)          — indentation size,
  // indent_char (default space)      — character to indent with,
  // max_char (default 70)            -  maximum amount of characters per line,
  // brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
  //         put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
  // unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
  // indent_scripts (default normal)  - "keep"|"separate"|"normal"
  export interface Opts {
    indent_size?: number
    indent_char?: string
    max_char?: number
    brace_style?: 'collapse' | 'expand' | 'end-expand'
    unformatted?: string[]
    indent_scripts?: 'keep' | 'separate' | 'normal'
  }
  export const prettyPrint = (html: string, opts?: Opts) => string
}
