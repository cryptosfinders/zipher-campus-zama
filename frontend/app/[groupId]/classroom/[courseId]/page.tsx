import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CoursePageClient } from "@/features/classroom/components/course/course-page-client";

export default async function CoursePage({
  params,
}: {
  params: { groupId: string; courseId: string };
}) {
  const groupId = params.groupId as Id<"groups">;
  const courseId = params.courseId as Id<"courses">;

  const course = await fetchQuery(api.courses.getById, { id: courseId });

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <CoursePageClient
      groupId={groupId}
      courseId={courseId}
    />
  );
}

