// 레시피 카테고리 타입
export type RecipeCategory = "한식" | "양식" | "일식" | "중식" | "기타";

// 레시피 난이도 타입
export type RecipeDifficulty = "쉬움" | "보통" | "어려움";

// 조리시간 필터 옵션 타입
export type CookTimeFilter = "전체" | "15분 이하" | "30분 이하" | "30분 초과";

/**
 * 홈 페이지 카드 목록 및 필터에 사용되는 레시피 메타데이터
 * Notion DB 속성에서 추출한 값만 포함 (본문 블록 제외)
 */
export interface RecipeMeta {
  // Notion 페이지 ID (상세 페이지 라우팅에 사용)
  id: string;
  // 레시피 제목
  title: string;
  // 카테고리 (한식 / 양식 / 일식 / 중식 / 기타)
  category: RecipeCategory;
  // 난이도 (쉬움 / 보통 / 어려움)
  difficulty: RecipeDifficulty;
  // 조리시간 (분 단위)
  cookTime: number;
  // 인분
  servings: number;
  // 대표 이미지 URL (Notion 파일 URL, 1시간 만료)
  coverUrl: string | null;
}

/**
 * 레시피 상세 페이지에 사용되는 전체 데이터
 * 메타데이터 + Notion 본문을 Markdown으로 변환한 content 포함
 */
export interface RecipeDetail extends RecipeMeta {
  // notion-to-md로 변환된 Markdown 문자열 (재료, 조리 순서, 사진 등)
  content: string;
}

/**
 * 홈 페이지 필터 상태 타입
 */
export interface RecipeFilter {
  category: RecipeCategory | "전체";
  difficulty: RecipeDifficulty | "전체";
  cookTime: CookTimeFilter;
}
