import React, { useState } from "react";
import { Book } from "../../../lib/utils";
import { BookEditForm } from "./BookEditForm";
import { BookInfo } from "./BookInfo";

export const BookItem: React.FC<Book> = ({ id, title, categories }) => {
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
