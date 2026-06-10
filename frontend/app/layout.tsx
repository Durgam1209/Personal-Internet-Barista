import {ClerkProvider} from "@clerk/nextjs";
import "./globals.css";
import type { ReactNode } from "react";
import { Lora, Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-serif-custom",
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans-custom",
});

export const metadata = {
    title: "personal.cafe",
    description: "AI Daily Engineering Digest",
};

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en" className={`${lora.variable} ${inter.variable}`}>
            <body>
              <ClerkProvider>
                <AuthProvider>
                {children}
                </AuthProvider>
              </ClerkProvider>
            </body>
        </html>
    );
}