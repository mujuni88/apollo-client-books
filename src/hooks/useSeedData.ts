import { Reference, gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Book, Category } from "../lib/utils";

const SEED_DATA = gql`
  mutation SeedData($filter: String!) {
    seedData(filter: $filter) {
      books {
        id
        title
        categories {
          id
          name
        }
      }
      categories {
        id
        name
      }
    }
  }
`;

type ResponseData = {
  seedData: {
    books: Book[];
    categories: Category[];
  };
};
export const useSeedData = () => {
  const [_seedData, { loading, error }] = useMutation<ResponseData>(SEED_DATA, {
    onError() {
      toast.error("Error seeding app");
    },
    onCompleted() {
      toast.success("App seeded successfully");
    },
  });

  const seedData = async () => {
    _seedData({
      variables: { filter: "Empty" },
      update(cache, { data }) {
        if (!data?.seedData) return;

        cache.modify({
          fields: {
            categories(existingCategories: Reference[], { toReference }) {
              const newCategories = data.seedData.categories.map(
                (c: Category) => toReference(c) as Reference,
              );

              // Create a Set to store unique __ref values
              const uniqueRefs = new Set(
                existingCategories.map((e) => e.__ref),
              );

              // Filter out duplicate categories based on their __ref values
              const uniqueNewCategories = newCategories.filter(
                (c: Reference) => {
                  if (!uniqueRefs.has(c.__ref)) {
                    uniqueRefs.add(c.__ref);
                    return true;
                  }
                  return false;
                },
              );

              return [...existingCategories, ...uniqueNewCategories];
            },
            books(existingBooks: Reference[], { toReference }) {
              const newBooks = data.seedData.books.map(
                (b: Book) => toReference(b) as Reference,
              ); // Note: Changed from categories to books

              // Create a Set to store unique __ref values
              const uniqueRefs = new Set(existingBooks.map((e) => e.__ref));

              // Filter out duplicate books based on their __ref values
              const uniqueNewBooks = newBooks.filter((b: Reference) => {
                if (!uniqueRefs.has(b.__ref)) {
                  uniqueRefs.add(b.__ref);
                  return true;
                }
                return false;
              });

              return [...existingBooks, ...uniqueNewBooks];
            },
          },
        });
      },
    });
  };
  return {
    loading,
    error,
    seedData,
  };
};
