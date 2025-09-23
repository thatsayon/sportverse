export interface SportCategory {
  id: string;
  name: string;
  image: string;
}

export interface SportCategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SportCategory[];
}