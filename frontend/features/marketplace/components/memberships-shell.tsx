"use client";

import { useWallet } from "@/lib/web3/WalletProvider";
import { useEncryptedCourses } from "@/hooks/use-encrypted-courses";
import { EncryptedCourseCard } from "./encrypted-course-card";
import { LoadingIndicator } from "@/components/feedback/loading-indicator";

export function MembershipsShell() {
  const { address } = useWallet();
  const { myEncryptedCourses } = useEncryptedCourses(address);

  if (!address) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Connect your wallet to view your courses.
      </div>
    );
  }

  if (!myEncryptedCourses) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* 🔷 HEADER / HERO */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-background via-background to-[#F5B700]/10 p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,183,0,0.12),transparent_60%)]" />

        <div className="relative z-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F5B700]/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#F5B700]">
            🔐 Encrypted Courses
          </span>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight">
            My{" "}
            <span className="bg-gradient-to-r from-[#F5B700] to-[#FF6A00] bg-clip-text text-transparent">
              Courses
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            These are the encrypted learning materials you submitted or unlocked
            through the Zipher Campus FHE-VM. Fully private, fully yours.
          </p>
        </div>
      </div>

      {/* 🔲 CONTENT */}
      {myEncryptedCourses.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 text-center">
          <div className="mb-3 text-4xl">🎟️</div>
          <h3 className="text-lg font-semibold">No Courses Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit or unlock an encrypted course to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myEncryptedCourses.map((course) => (
  <EncryptedCourseCard
    key={course.groupId}
    item={course}
  />
))}

        </div>
      )}
    </div>
  );
}

export default MembershipsShell
