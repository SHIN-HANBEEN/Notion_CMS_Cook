import Image from "next/image";
import Link from "next/link";
import { Clock, ChefHat, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecipeMeta } from "@/types/recipe";

interface RecipeCardProps {
  recipe: RecipeMeta;
}

// 난이도별 배지 색상 매핑
const difficultyColor: Record<RecipeMeta["difficulty"], string> = {
  쉬움: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  보통: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  어려움: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

/**
 * 레시피 한 건을 카드 형태로 표시하는 컴포넌트
 * 썸네일, 제목, 카테고리 배지, 조리시간/난이도/인분 메타 정보를 포함합니다.
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow duration-200 hover:shadow-lg">
        {/* 썸네일 이미지 영역 */}
        <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
          {recipe.coverUrl ? (
            <Image
              src={recipe.coverUrl}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // 이미지가 없을 때 플레이스홀더
            <div className="text-muted-foreground flex h-full items-center justify-center text-4xl">
              🍽️
            </div>
          )}
          {/* 카테고리 배지 - 이미지 좌상단 오버레이 */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {recipe.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* 레시피 제목 */}
          <h3 className="group-hover:text-primary mb-3 line-clamp-2 text-base leading-snug font-semibold">
            {recipe.title}
          </h3>

          {/* 메타 정보: 조리시간, 난이도, 인분 */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
            {/* 조리시간 */}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.cookTime}분
            </span>

            {/* 난이도 */}
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[recipe.difficulty]}`}
            >
              <ChefHat className="h-3 w-3" />
              {recipe.difficulty}
            </span>

            {/* 인분 */}
            {recipe.servings > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {recipe.servings}인분
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
