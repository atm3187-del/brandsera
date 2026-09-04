import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders blog markdown: paragraphs, headings, lists, clickable links and images. */
export function BlogContent({ content }: { content: string }) {
  return (
    <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//i.test(href);
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer nofollow" : undefined}
                className="font-bold text-primary underline underline-offset-2 hover:opacity-80"
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              loading="lazy"
              className="my-6 w-full rounded-md border-2 border-foreground object-cover"
            />
          ),
          h1: ({ children }) => <h2 className="mt-8 font-display text-3xl font-black uppercase">{children}</h2>,
          h2: ({ children }) => <h2 className="mt-8 font-display text-2xl font-black uppercase">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 font-display text-xl font-black">{children}</h3>,
          p: ({ children }) => <p className="whitespace-pre-line">{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 font-medium">{children}</blockquote>,
          strong: ({ children }) => <strong className="font-black">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
