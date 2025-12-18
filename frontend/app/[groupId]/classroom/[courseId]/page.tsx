import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CoursePageClient } from "@/features/classroom/components/course/course-page-client";

type PageProps = {
  params: Promise<{
    groupId: string;
    courseId: string;
  }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { groupId, courseId } = await params;

  const groupIdTyped = groupId as Id<"groups">;
  const courseIdTyped = courseId as Id<"courses">;

  const course = await fetchQuery(api.courses.getById, {
    id: courseIdTyped,
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <CoursePageClient
      groupId={groupIdTyped}
      courseId={courseIdTyped}
    />
  );
}
