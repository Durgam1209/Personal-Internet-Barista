import fallback from "@/data/fallback.json";

export async function getDigest() {
    try {
        const res = await fetch(
            "https://your-api.com/digest",
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