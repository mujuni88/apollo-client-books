import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { AddCategory } from "./AddCategory";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { CategoryItem } from "./CategoryItem";

export function Categories() {
  const { categories, loading, error } = useGetCategories();
  const isEmpty = !categories.length && !loading && !error;

  return (
    <Card className="max-w-[500]">
      <CardHeader className="flex flex-col gap-3">
        <h1 className="text-2xl">Categories</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        <AddCategory />
        {isEmpty && (
          <p className="text-center my-5 text-zinc-400">No categories found</p>
        )}
        <ul className="mt-10 p-5 flex flex-col gap-3">
          {categories.map((c) => (
            <CategoryItem key={c.id} name={c.name} id={c.id} />
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
