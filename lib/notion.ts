import { Client } from "@notionhq/client";
import { z } from "zod";
import type { RecipeDetail, RecipeMeta } from "@/types/recipe";

// ─── 환경변수 검증 ───────────────────────────────────────────────────────────
// 빌드/런타임 시작 시 환경변수가 올바르게 설정되었는지 Zod로 검증
const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY가 설정되지 않았습니다."),
  NOTION_DATABASE_ID: z.string().min(1, "NOTION_DATABASE_ID가 설정되지 않았습니다."),
});

const env = envSchema.parse({
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
});

// ─── Notion 클라이언트 초기화 ────────────────────────────────────────────────
// 서버 사이드 전용. 클라이언트 컴포넌트에서 직접 호출 금지
// @notionhq/client v5.x: databases.query → dataSources.query로 API 변경
const notion = new Client({ auth: env.NOTION_API_KEY });

// ─── 헬퍼: Notion 속성 파싱 ──────────────────────────────────────────────────

/**
 * Notion Title 속성에서 텍스트 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTitle(property: any): string {
  if (!property || property.type !== "title" || !property.title) return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return property.title.map((t: any) => t.plain_text).join("");
}

/**
 * Notion Select 속성에서 선택값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSelect(property: any): string {
  if (!property || property.type !== "select" || !property.select) return "";
  return property.select.name ?? "";
}

/**
 * Notion Number 속성에서 숫자 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNumber(property: any): number {
  if (!property || property.type !== "number" || property.number == null) return 0;
  return property.number;
}

/**
 * Notion Files 속성에서 첫 번째 파일 URL 추출
 * Notion 내부 파일의 경우 서명 URL(1시간 만료)을 반환
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCoverUrl(property: any): string | null {
  if (!property || property.type !== "files" || !property.files || property.files.length === 0) {
    return null;
  }
  const file = property.files[0];
  if (file.type === "file" && file.file) return file.file.url;
  if (file.type === "external" && file.external) return file.external.url;
  return null;
}

/**
 * Notion 페이지 속성 객체에서 RecipeMeta를 추출하는 공통 함수
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRecipeMeta(id: string, props: any): RecipeMeta {
  return {
    id,
    // Notion DB 속성명은 한국어/영어 모두 지원 (둘 다 시도)
    title: getTitle(props.title ?? props.Name ?? props["레시피 제목"]),
    category: (getSelect(props.category ?? props["카테고리"]) || "기타") as RecipeMeta["category"],
    difficulty: (getSelect(props.difficulty ?? props["난이도"]) ||
      "보통") as RecipeMeta["difficulty"],
    cookTime: getNumber(props.cook_time ?? props["조리시간"]),
    servings: getNumber(props.servings ?? props["인분"]),
    coverUrl: getCoverUrl(props.cover ?? props["대표 이미지"]),
  };
}

// ─── 주요 API 함수 ────────────────────────────────────────────────────────────

/**
 * Notion DB에서 공개된 레시피 목록을 모두 가져옵니다.
 * published = true인 항목만 조회하며, 생성일 내림차순으로 정렬합니다.
 *
 * @notionhq/client v5.x: notion.dataSources.query() 사용
 * ISR revalidate: 1800초(30분) — Notion 이미지 URL 1시간 만료 전에 갱신
 */
export async function getRecipes(): Promise<RecipeMeta[]> {
  // v5.x: database_id → data_source_id 로 파라미터명 변경
  const response = await notion.dataSources.query({
    data_source_id: env.NOTION_DATABASE_ID,
    // published 체크박스가 true인 레시피만 노출
    filter: {
      property: "published",
      checkbox: { equals: true },
    },
    // 최신 레시피 먼저 노출
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  // Notion 페이지 결과를 RecipeMeta 타입으로 변환
  return response.results
    .filter((page) => "properties" in page)
    .map((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = (page as any).properties;
      return extractRecipeMeta(page.id, props);
    });
}

/**
 * 특정 레시피의 상세 정보를 가져옵니다.
 * 메타데이터와 함께 페이지 본문을 Markdown으로 변환하여 반환합니다.
 *
 * @notionhq/client v5.x: pages.retrieveMarkdown()으로 본문을 바로 Markdown으로 수신
 * notion-to-md 라이브러리 없이 공식 API 한 번의 호출로 처리 가능
 *
 * @param pageId - Notion 페이지 ID
 */
export async function getRecipeDetail(pageId: string): Promise<RecipeDetail | null> {
  try {
    // 1. 페이지 메타데이터 fetch
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!("properties" in page)) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (page as any).properties;
    const meta = extractRecipeMeta(page.id, props);

    // 2. 페이지 본문을 Markdown으로 직접 fetch
    // v5.x의 pages.retrieveMarkdown()은 Notion 블록을 Markdown으로 변환하여 반환
    const markdownResponse = await notion.pages.retrieveMarkdown({ page_id: pageId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (markdownResponse as any).markdown ?? "";

    return { ...meta, content };
  } catch (error) {
    console.error(`레시피 상세 fetch 실패 (pageId: ${pageId}):`, error);
    return null;
  }
}

/**
 * 정적 경로 생성에 사용할 모든 레시피 ID 목록을 반환합니다.
 * app/recipe/[id]/page.tsx의 generateStaticParams에서 호출합니다.
 */
export async function getRecipeIds(): Promise<string[]> {
  const recipes = await getRecipes();
  return recipes.map((r) => r.id);
}
