import { FC } from "react";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";
import { Category, toCategoryOptions } from "../lib/utils";

interface CategoryDropdownProps extends Omit<SelectProps, "children"> {
  onCategoryChange: (val: Set<string>) => void;
  categories: Category[];
  selectedCategories: Set<string>;
}
export const CategoryDropdown: FC<CategoryDropdownProps> = ({
  onCategoryChange,
  categories,
  selectedCategories,
  ...rest
}) => {
  return (
    <Select
      size="sm"
      variant="underlined"
      label="Category"
      placeholder="Select Category"
      selectionMode="multiple"
      {...rest}
      selectedKeys={selectedCategories}
      onChange={(e) => {
        const val = e.target.value.trim().split(",");
        onCategoryChange?.(new Set(val));
      }}
    >
      {toCategoryOptions(categories).map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};
