"use client";

import { useEncryptedMarketCourses } from "@/hooks/use-encrypted-market-courses";
import { EncryptedCourseCard } from "./encrypted-course-card";
import { LoadingIndicator } from "@/components/feedback/loading-indicator";

export function EncryptedMarketplaceShell() {
  const { data, loading } = useEncryptedMarketCourses();

  if (loading) return <LoadingIndicator fullScreen />;

  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-20">
        No encrypted paid courses available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((c) => (
        <EncryptedCourseCard key={c.courseId} item={c} />
      ))}
    </div>
  );
}
