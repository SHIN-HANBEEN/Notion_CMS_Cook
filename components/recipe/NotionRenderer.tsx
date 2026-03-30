import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface NotionRendererProps {
  content: string;
}

/**
 * notion-to-md가 변환한 Markdown 문자열을 HTML로 렌더링하는 컴포넌트
 * react-markdown을 사용하여 각 요소에 Tailwind CSS 스타일을 적용합니다.
 * shadcn/ui 테마 변수를 활용하여 다크모드를 자동 지원합니다.
 */
export function NotionRenderer({ content }: NotionRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}

/**
 * react-markdown 커스텀 렌더러
 * 각 Markdown 요소에 Tailwind CSS 클래스를 직접 적용합니다.
 */
const markdownComponents: Components = {
  // h1 ~ h3: 레시피 섹션 제목 (재료, 조리 순서 등)
  h1: ({ children }) => (
    <h1 className="text-foreground mt-8 mb-4 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-foreground mt-6 mb-3 text-xl font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-foreground mt-4 mb-2 text-lg font-semibold">{children}</h3>
  ),

  // 단락
  p: ({ children }) => <p className="text-foreground/90 mb-4 leading-7">{children}</p>,

  // 순서 없는 목록 (재료 목록 등)
  ul: ({ children }) => (
    <ul className="text-foreground/90 mb-4 ml-6 list-disc space-y-1">{children}</ul>
  ),

  // 순서 있는 목록 (조리 순서)
  ol: ({ children }) => (
    <ol className="text-foreground/90 mb-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),

  li: ({ children }) => <li className="leading-7">{children}</li>,

  // 구분선 (섹션 구분)
  hr: () => <hr className="border-border my-6" />,

  // 인용구 (팁, 메모 등)
  blockquote: ({ children }) => (
    <blockquote className="border-primary text-muted-foreground my-4 border-l-4 pl-4 italic">
      {children}
    </blockquote>
  ),

  // 이미지 (조리 과정 사진)
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="my-4 w-full rounded-lg object-cover shadow-sm"
      loading="lazy"
    />
  ),

  // 인라인 코드
  code: ({ children }) => (
    <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>
  ),

  // 강조 (볼드)
  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
};
