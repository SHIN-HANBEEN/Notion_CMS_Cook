import { getRecipes } from "@/lib/notion";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";

/**
 * 홈 페이지 (서버 컴포넌트)
 *
 * ISR 방식으로 Notion DB에서 레시피 목록을 fetch합니다.
 * revalidate: 1800 (30분) — Notion 이미지 URL 1시간 만료 전에 갱신
 *
 * 실제 필터링은 RecipeGrid(클라이언트 컴포넌트)에서 처리합니다.
 */
export const revalidate = 1800;

export default async function HomePage() {
  // Notion DB에서 공개된 레시피 목록 전체 fetch
  const recipes = await getRecipes();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">🍳 레시피</h1>
        <p className="text-muted-foreground mt-2">집에서 만들어 먹는 간단하고 맛있는 레시피 모음</p>
      </div>

      {/* 레시피 그리드 + 필터 (클라이언트 컴포넌트) */}
      <RecipeGrid recipes={recipes} />
    </div>
  );
}
