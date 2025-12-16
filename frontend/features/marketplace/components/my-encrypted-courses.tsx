"use client";

import { useEncryptedCourses } from "@/hooks/use-encrypted-courses";
import { useWallet } from "@/lib/web3/WalletProvider";
import { EncryptedCourseGrid } from "./encrypted-course-grid";

export function MyEncryptedCourses() {
  const { address } = useWallet();
  const { myEncryptedCourses } = useEncryptedCourses(address);

  const normalizedCourses = myEncryptedCourses.map(course => ({
    groupId: course.groupId,
    title: course.name,
    description: course.shortDescription,
    thumbnail: course.thumbnailUrl,
    price: course.price,
    status: course.status,
  }));

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-3">My Courses</h2>
      <p className="text-muted-foreground mb-6">
        Encrypted FH-EVM courses you submitted or unlocked.
      </p>

      {normalizedCourses.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No encrypted courses yet.
        </div>
      ) : (
        <EncryptedCourseGrid courses={normalizedCourses} />
      )}
    </section>
  );
}
