export const PageCategories = ["console"] as const;

export type PageCategory = (typeof PageCategories)[number];
