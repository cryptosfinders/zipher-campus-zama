import { MembershipsShell } from "@/features/marketplace/components/memberships-shell";
import { MyEncryptedCourses } from "@/features/marketplace/components/my-encrypted-courses";

export default function MembershipsPage() {
  return (
    <div className="space-y-8 p-6">
      <MembershipsShell />

      {/* NEW — your encrypted courses */}
      <MyEncryptedCourses />
    </div>
  );
}

