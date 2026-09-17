export interface Author {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  bio?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  icon: string;
  color?: string;
}

export type ArticleBlock =
  | { type: "html"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id?: string }
  | { type: "list"; style: "ordered" | "unordered"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "blockquote"; text: string; cite?: string }
  | {
      type: "quran";
      arabic: string;
      translation: string;
      surah: string;
      ayah: string;
      note?: string;
    }
  | {
      type: "hadith";
      text: string;
      source: string;
      grade?: string;
      note?: string;
    }
  | {
      type: "dua";
      title: string;
      arabic: string;
      transliteration?: string;
      translation: string;
    }
  | {
      type: "callout";
      variant: "tip" | "note" | "warning" | "info";
      title?: string;
      text: string;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "faq";
      items: { question: string; answer: string }[];
    }
  | {
      type: "video";
      src: string;
      title: string;
      poster?: string;
    };

export interface ArticleSeo {
  title?: string;
  description?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  authorId: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  image: string;
  imageAlt: string;
  featured?: boolean;
  popular?: boolean;
  popularRank?: number;
  tags?: string[];
  content: ArticleBlock[];
  seo?: ArticleSeo;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SearchResult {
  article: Article;
  categoryName: string;
}
