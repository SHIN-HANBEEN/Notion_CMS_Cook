import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, ChefHat, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotionRenderer } from "@/components/recipe/NotionRenderer";
import { getRecipeDetail, getRecipeIds } from "@/lib/notion";
import type { Metadata } from "next";

/**
 * ISR 설정: 30분마다 자동 재빌드
 * Notion 이미지 URL 1시간 만료 전에 갱신하여 이미지가 깨지지 않도록 합니다.
 */
export const revalidate = 1800;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 빌드 시 정적 경로를 미리 생성합니다.
 * Notion DB의 모든 레시피 ID를 기반으로 /recipe/[id] 경로를 생성합니다.
 */
export async function generateStaticParams() {
  const ids = await getRecipeIds();
  return ids.map((id) => ({ id }));
}

/**
 * 페이지별 SEO 메타데이터 생성
 * 레시피 제목과 카테고리를 활용하여 Open Graph 태그를 설정합니다.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeDetail(id);

  if (!recipe) return { title: "레시피를 찾을 수 없어요" };

  return {
    title: `${recipe.title} | 나만의 레시피`,
    description: `${recipe.category} · ${recipe.difficulty} · ${recipe.cookTime}분`,
    openGraph: {
      title: recipe.title,
      description: `${recipe.category} 레시피 · 조리시간 ${recipe.cookTime}분`,
      images: recipe.coverUrl ? [{ url: recipe.coverUrl }] : [],
    },
  };
}

/**
 * 레시피 상세 페이지 (서버 컴포넌트)
 *
 * Notion 페이지 ID로 메타데이터 + 본문을 fetch하여 렌더링합니다.
 * 본문은 notion-to-md로 Markdown 변환 후 NotionRenderer로 표시합니다.
 */
export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Notion에서 레시피 상세 데이터 fetch
  const recipe = await getRecipeDetail(id);

  // 존재하지 않는 레시피는 404 처리
  if (!recipe) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 뒤로가기 링크 */}
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        레시피 목록으로
      </Link>

      {/* 대표 이미지 */}
      {recipe.coverUrl && (
        <div className="bg-muted relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* 레시피 제목 */}
      <h1 className="mb-4 text-3xl font-bold tracking-tight">{recipe.title}</h1>

      {/* 메타 정보 배지 영역 */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{recipe.category}</Badge>

        <span className="text-muted-foreground flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4" />
          {recipe.cookTime}분
        </span>

        <span className="text-muted-foreground flex items-center gap-1 text-sm">
          <ChefHat className="h-4 w-4" />
          {recipe.difficulty}
        </span>

        {recipe.servings > 0 && (
          <span className="text-muted-foreground flex items-center gap-1 text-sm">
            <Users className="h-4 w-4" />
            {recipe.servings}인분
          </span>
        )}
      </div>

      <hr className="border-border mb-8" />

      {/* 레시피 본문 (Notion 블록 → Markdown → HTML) */}
      <NotionRenderer content={recipe.content} />

      {/* 하단 뒤로가기 링크 */}
      <div className="border-border mt-12 border-t pt-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          다른 레시피 보기
        </Link>
      </div>
    </div>
  );
}
