"use client";

import { useState } from "react";

export default function DigestCard({
    emoji,
    title,
    subtitle,
    content,
}: any) {
    const [open, setOpen] = useState(false);

    return (
        <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-600 transition"
        >
            <div className="flex justify-between items-center">

                <div>
                    <h2 className="text-3xl font-bold">
                        {emoji} {title}
                    </h2>

                    <p className="text-zinc-400 mt-2">
                        {subtitle}
                    </p>
                </div>

                <div className="text-3xl">
                    {open ? "−" : "+"}
                </div>

            </div>

            {open && (
                <div className="mt-8 text-zinc-300 leading-8 whitespace-pre-line">
                    {content}
                </div>
            )}
        </div>
    );
}