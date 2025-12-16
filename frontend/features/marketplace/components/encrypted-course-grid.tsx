"use client";

type EncryptedCourseItem = {
  id?: string;
  groupId?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  billingCadence?: string;
  status?: "active" | "expired";
};

function MembershipStatusBadge({
  status,
}: {
  status?: "active" | "expired";
}) {
  const isActive = (status ?? "active") === "active";

  return (
    <span
      className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold
        ${
          isActive
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-red-500/15 text-red-400"
        }`}
    >
      {isActive ? "ACTIVE" : "EXPIRED"}
    </span>
  );
}

export function EncryptedCourseGrid({
  courses,
}: {
  courses: EncryptedCourseItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => {
        const key = c.groupId ?? c.id;

        if (!key) {
          console.warn("EncryptedCourseGrid item missing key", c);
        }

        return (
          <div
            key={key}
            className={`relative rounded-xl border border-border p-4 transition
              ${(c.status ?? "active") !== "active"
                ? "opacity-60 grayscale"
                : "hover:bg-accent/10"}`}
          >
            <MembershipStatusBadge status={c.status} />

            <div className="aspect-video rounded-lg bg-muted overflow-hidden">
              {c.thumbnail ? (
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No thumbnail
                </div>
              )}
            </div>

            <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>

            {c.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {c.description}
              </p>
            )}

            <p className="mt-2 text-xs">
              Price:{" "}
              <span className="font-semibold text-primary">
                {c.price} USD / {c.billingCadence ?? "month"}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
