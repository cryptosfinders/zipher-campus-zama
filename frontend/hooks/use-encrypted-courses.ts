import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useEncryptedCourses(address?: string) {
  const myEncryptedCourses = useQuery(
  api.encryptedCourses.listMineWithStatus,
  address ? { address } : "skip"
);

  const marketplaceCourses = useQuery(
    api.encryptedCourses.listMarketplace
  );

  const submitEncryptedCourse = useMutation(
    api.encryptedCourses.submit
  );

  return {
    myEncryptedCourses: myEncryptedCourses ?? [],
    marketplaceCourses: marketplaceCourses ?? [],
    submitEncryptedCourse,
  };
}
