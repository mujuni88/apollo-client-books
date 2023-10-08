import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Category = {
  __typename?: string;
  id: string;
  name: string;
};
export type Book = {
  __typename?: string;
  id: string;
  title: string;
  categories?: Category[];
};

export type BookFilter = {
  categoryId: string;
};

export const toCategoryOptions = (categories: Category[]) =>
  categories.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
