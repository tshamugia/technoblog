"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CodeBlockProps } from "@/types";

export default function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const lines = code.split("\n");

  // Enhanced syntax highlighting function
  const highlightCode = (code: string, lang: string): string => {
    if (!lang) return code;

    let highlightedCode = code;

    // JavaScript/TypeScript highlighting
    if (
      ["javascript", "js", "typescript", "ts", "tsx", "jsx"].includes(
        lang.toLowerCase(),
      )
    ) {
      // Keywords
      highlightedCode = highlightedCode.replace(
        /\b(const|let|var|function|class|interface|type|export|import|from|as|default|if|else|for|while|return|async|await|try|catch|finally)\b/g,
        '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>',
      );

      // Strings
      highlightedCode = highlightedCode.replace(
        /(["'`])(?:(?=(\\?))\2.)*?\1/g,
        '<span class="text-green-600 dark:text-green-400">$&</span>',
      );

      // Numbers
      highlightedCode = highlightedCode.replace(
        /\b\d+\.?\d*\b/g,
        '<span class="text-blue-600 dark:text-blue-400">$&</span>',
      );

      // Comments
      highlightedCode = highlightedCode.replace(
        /\/\/.*$/gm,
        '<span class="text-gray-500 dark:text-gray-400 italic">$&</span>',
      );

      // Functions
      highlightedCode = highlightedCode.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
        '<span class="text-yellow-600 dark:text-yellow-400">$1</span>',
      );
    }

    // CSS highlighting
    if (lang.toLowerCase() === "css") {
      // Properties
      highlightedCode = highlightedCode.replace(
        /([a-zA-Z-]+)(\s*:)/g,
        '<span class="text-blue-600 dark:text-blue-400">$1</span>$2',
      );

      // Values
      highlightedCode = highlightedCode.replace(
        /(:\s*)([^;]+)(;?)/g,
        '$1<span class="text-green-600 dark:text-green-400">$2</span>$3',
      );

      // Selectors
      highlightedCode = highlightedCode.replace(
        /^([.#]?[a-zA-Z][a-zA-Z0-9-_]*)/gm,
        '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>',
      );
    }

    // HTML highlighting
    if (lang.toLowerCase() === "html") {
      // Tags
      highlightedCode = highlightedCode.replace(
        /<\/?([a-zA-Z][a-zA-Z0-9]*)/g,
        '&lt;<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>',
      );

      // Attributes
      highlightedCode = highlightedCode.replace(
        /(\s)([a-zA-Z-]+)(=)/g,
        '$1<span class="text-purple-600 dark:text-purple-400">$2</span>$3',
      );

      // Attribute values
      highlightedCode = highlightedCode.replace(
        /(=)(["'])([^"']*)\2/g,
        '$1$2<span class="text-green-600 dark:text-green-400">$3</span>$2',
      );
    }

    // JSON highlighting
    if (lang.toLowerCase() === "json") {
      // Keys
      highlightedCode = highlightedCode.replace(
        /"([^"]+)"(\s*:)/g,
        '<span class="text-blue-600 dark:text-blue-400">"$1"</span>$2',
      );

      // String values
      highlightedCode = highlightedCode.replace(
        /(:\s*)"([^"]+)"/g,
        '$1<span class="text-green-600 dark:text-green-400">"$2"</span>',
      );

      // Numbers and booleans
      highlightedCode = highlightedCode.replace(
        /(:\s*)(\d+\.?\d*|true|false|null)/g,
        '$1<span class="text-purple-600 dark:text-purple-400">$2</span>',
      );
    }

    return highlightedCode;
  };

  return (
    <div className="group relative my-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-t-lg px-4 py-2">
        <div className="flex items-center space-x-2">
          {filename && (
            <span className="text-sm font-medium text-slate-200">
              {filename}
            </span>
          )}
          <span className="text-xs text-slate-400 uppercase tracking-wide">
            {language}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-100 hover:bg-slate-700"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">{copied ? "Copied" : "Copy code"}</span>
        </Button>
      </div>

      {/* Code content */}
      <div className="relative">
        <pre className="overflow-x-auto bg-slate-950 border border-t-0 border-slate-700 rounded-b-lg p-4">
          <code className={cn("text-sm font-mono", "text-slate-200")}>
            {showLineNumbers ? (
              <div className="flex">
                <div className="select-none text-slate-500 mr-4 text-right min-w-[3rem]">
                  {lines.map((_, index) => (
                    <div key={index} className="leading-6">
                      {index + 1}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className="leading-6"
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(line || " ", language),
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightCode(code, language),
                }}
              />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Basic syntax highlighting classes (can be enhanced with a proper syntax highlighter)
function getLanguageClasses(language: string): string {
  const baseClasses = "font-mono";

  switch (language.toLowerCase()) {
    case "javascript":
    case "js":
      return `${baseClasses} text-blue-600 dark:text-blue-400`;
    case "typescript":
    case "ts":
      return `${baseClasses} text-blue-700 dark:text-blue-300`;
    case "tsx":
    case "jsx":
      return `${baseClasses} text-purple-600 dark:text-purple-400`;
    case "css":
      return `${baseClasses} text-green-600 dark:text-green-400`;
    case "html":
      return `${baseClasses} text-orange-600 dark:text-orange-400`;
    case "bash":
    case "shell":
      return `${baseClasses} text-gray-600 dark:text-gray-400`;
    case "json":
      return `${baseClasses} text-yellow-600 dark:text-yellow-400`;
    default:
      return `${baseClasses} text-foreground`;
  }
}
