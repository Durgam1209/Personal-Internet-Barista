"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

interface AuthUser {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isGuest: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginAsGuest: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn, user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const [isGuest, setIsGuest] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const guest = localStorage.getItem("personal-cafe-guest") === "true";
            setIsGuest(guest);
        }
    }, []);

    const signInWithGoogle = async () => {
        // Redirect the user to Clerk's sign-in page, which contains Google sign-in
        window.location.href = "/sign-in";
    };

    const loginAsGuest = () => {
        setIsGuest(true);
        if (typeof window !== "undefined") {
            localStorage.setItem("personal-cafe-guest", "true");
        }
    };

    const logout = async () => {
        try {
            await signOut();
            setIsGuest(false);
            if (typeof window !== "undefined") {
                localStorage.removeItem("personal-cafe-guest");
            }
        } catch (error) {
            console.warn("Error signing out:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn && clerkUser) {
                setUser({
                    displayName: clerkUser.fullName || clerkUser.username || null,
                    email: clerkUser.primaryEmailAddress?.emailAddress || null,
                    photoURL: clerkUser.imageUrl || null,
                });
                setIsGuest(false); // Clear guest status if signed in
                if (typeof window !== "undefined") {
                    localStorage.removeItem("personal-cafe-guest");
                }
            } else {
                setUser(null);
            }
        }
    }, [isLoaded, isSignedIn, clerkUser]);

    return (
        <AuthContext.Provider value={{
            user,
            isGuest,
            loading: !isLoaded,
            signInWithGoogle,
            loginAsGuest,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
