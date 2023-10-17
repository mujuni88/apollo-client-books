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
  categoryIds: string[];
};

export const toCategoryOptions = (categories: Category[]) =>
  categories.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  export function getParamsFromStoreFieldName(storeFieldName: string) {
    // Find the start and end indices of the JSON parameters.
    const start = storeFieldName.indexOf('{');
    const end = storeFieldName.lastIndexOf('}');
  
    // If no JSON parameters were found, return null.
    if (start === -1 || end === -1) {
      return null;
    }
  
    // Extract the JSON parameters.
    const params = storeFieldName.slice(start, end + 1);
  
    // Parse the JSON parameters.
    try {
      return JSON.parse(params);
    } catch (error) {
      console.error(`Failed to parse parameters from storeFieldName: ${error.message}`);
      return null;
    }
  }