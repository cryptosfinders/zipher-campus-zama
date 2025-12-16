const RELAYER_URL =
  process.env.NEXT_PUBLIC_RELAYER_URL || "http://localhost:4002";

export async function registerCourse(ciphertext) {
  const res = await fetch(`${RELAYER_URL}/api/register-course`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ciphertext }),
  });

  return res.json();
}
