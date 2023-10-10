import { Button } from "@nextui-org/react";
import { useSeedData } from "../hooks/useSeedData";

export const SeedData = () => {
  const { seedData, loading } = useSeedData();

  return (
    <div className="fex gap-2">
      <Button variant="shadow" onClick={seedData} isLoading={loading}>
        Populate Data{" "}
      </Button>
    </div>
  );
};
