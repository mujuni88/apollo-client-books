import { Select, SelectItem } from "@nextui-org/react";

export const CategoryDropdown = () => {

  return (
    <Select
      size='sm'
      variant="underlined"
      label="Category"
      placeholder="Select Category"
      selectionMode="multiple"
      selectedKeys={categories}
      onChange={(e) => {
        const val = e.target.value.trim().split(',') as (keyof typeof Category)[];
        setCategories(new Set(val))
      }}
    >
      {categoriesOptions.map((option) =>
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      )}
    </Select>
  )
}