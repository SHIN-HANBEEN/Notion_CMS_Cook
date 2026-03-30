"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  RecipeFilter as RecipeFilterType,
  RecipeCategory,
  RecipeDifficulty,
  CookTimeFilter,
} from "@/types/recipe";

interface RecipeFilterProps {
  filter: RecipeFilterType;
  onChange: (filter: RecipeFilterType) => void;
}

// 카테고리 탭 옵션
const CATEGORIES: Array<RecipeCategory | "전체"> = ["전체", "한식", "양식", "일식", "중식", "기타"];

// 난이도 드롭다운 옵션
const DIFFICULTIES: Array<RecipeDifficulty | "전체"> = ["전체", "쉬움", "보통", "어려움"];

// 조리시간 드롭다운 옵션
const COOK_TIMES: CookTimeFilter[] = ["전체", "15분 이하", "30분 이하", "30분 초과"];

/**
 * 레시피 목록 필터 컴포넌트 (클라이언트 컴포넌트)
 * 카테고리 탭 + 난이도/조리시간 드롭다운으로 구성됩니다.
 * 필터 변경 시 페이지 이동 없이 부모 컴포넌트의 상태를 업데이트합니다.
 */
export function RecipeFilter({ filter, onChange }: RecipeFilterProps) {
  // 카테고리 탭 변경 핸들러
  const handleCategoryChange = (value: string) => {
    onChange({ ...filter, category: value as RecipeFilterType["category"] });
  };

  // 난이도 드롭다운 변경 핸들러
  const handleDifficultyChange = (value: string) => {
    onChange({ ...filter, difficulty: value as RecipeFilterType["difficulty"] });
  };

  // 조리시간 드롭다운 변경 핸들러
  const handleCookTimeChange = (value: string) => {
    onChange({ ...filter, cookTime: value as CookTimeFilter });
  };

  return (
    <div className="space-y-3">
      {/* 카테고리 탭 필터 */}
      <Tabs value={filter.category} onValueChange={handleCategoryChange}>
        <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary rounded-full border px-4 py-1.5 text-sm"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 난이도 + 조리시간 드롭다운 필터 */}
      <div className="flex flex-wrap gap-2">
        {/* 난이도 선택 */}
        <Select value={filter.difficulty} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="난이도" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>
                {d === "전체" ? "난이도 전체" : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 조리시간 선택 */}
        <Select value={filter.cookTime} onValueChange={handleCookTimeChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="조리시간" />
          </SelectTrigger>
          <SelectContent>
            {COOK_TIMES.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "전체" ? "시간 전체" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
