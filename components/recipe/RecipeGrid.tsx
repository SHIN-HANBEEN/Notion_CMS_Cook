"use client";

import { useState, useMemo } from "react";
import { RecipeCard } from "./RecipeCard";
import { RecipeFilter } from "./RecipeFilter";
import type { RecipeMeta, RecipeFilter as RecipeFilterType } from "@/types/recipe";

interface RecipeGridProps {
  recipes: RecipeMeta[];
}

/**
 * 레시피 목록 그리드 + 필터를 통합 관리하는 클라이언트 컴포넌트
 * 서버에서 전체 레시피 목록을 받아 클라이언트에서 필터링합니다.
 */
export function RecipeGrid({ recipes }: RecipeGridProps) {
  // 필터 상태: 초기값은 전체 표시
  const [filter, setFilter] = useState<RecipeFilterType>({
    category: "전체",
    difficulty: "전체",
    cookTime: "전체",
  });

  /**
   * 필터 조건에 맞는 레시피만 추출
   * filter 값이 바뀔 때만 재계산 (useMemo로 성능 최적화)
   */
  const filtered = useMemo(() => {
    return recipes.filter((recipe) => {
      // 카테고리 필터
      if (filter.category !== "전체" && recipe.category !== filter.category) return false;

      // 난이도 필터
      if (filter.difficulty !== "전체" && recipe.difficulty !== filter.difficulty) return false;

      // 조리시간 필터
      if (filter.cookTime === "15분 이하" && recipe.cookTime > 15) return false;
      if (filter.cookTime === "30분 이하" && recipe.cookTime > 30) return false;
      if (filter.cookTime === "30분 초과" && recipe.cookTime <= 30) return false;

      return true;
    });
  }, [recipes, filter]);

  return (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <RecipeFilter filter={filter} onChange={setFilter} />

      {/* 결과 수 표시 */}
      <p className="text-muted-foreground text-sm">
        레시피 <span className="text-foreground font-medium">{filtered.length}</span>개
      </p>

      {/* 레시피 카드 그리드 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        // 필터 결과가 없을 때 빈 상태 안내
        <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-3 text-5xl">🔍</span>
          <p className="text-base font-medium">조건에 맞는 레시피가 없어요</p>
          <p className="mt-1 text-sm">필터를 변경해서 다시 시도해보세요.</p>
        </div>
      )}
    </div>
  );
}
