import fallback from "@/data/fallback.json";

export async function getDigest() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(
            `${apiUrl}/digest`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) throw new Error();

        return await res.json();
    } catch {
        return fallback;
    }
}