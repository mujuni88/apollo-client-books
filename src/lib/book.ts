export const Category = {
  FICTION: 'Fiction',
  NON_FICTION: 'Non Fiction',
  BIOGRAPHY: 'Biography',
  SPORTS: 'Sports'
} as const;


export type BookInfo = {
  id: string;
  title: string;
  categories?: (keyof typeof Category)[]
};

export const categoriesOptions =  Object.entries(Category).map(([key, value]) => ({
  label: value,
  value: key,

}))