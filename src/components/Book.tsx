import React, { useState } from "react";
import { BookProps } from "../lib/book";
import { BookEditForm } from "./BookEditForm";
import { BookInfo } from "./BookInfo";

export const Book: React.FC<BookProps> = ({ id, title, categories }) => {
  const [edit, setEdit] = useState(false);

  return edit ? (
    <BookEditForm
      id={id}
      title={title}
      categories={categories}
      onFinish={() => setEdit(false)}
    />
  ) : (
    <BookInfo
      id={id}
      title={title}
      categories={categories}
      onEdit={() => setEdit(true)}
    />
  );
};
