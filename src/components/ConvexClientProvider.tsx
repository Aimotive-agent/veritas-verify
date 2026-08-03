"use client";

import { ReactNode, createContext, useContext } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://192.168.1.42:3210";

let convex: ConvexReactClient | null = null;

try {
  convex = new ConvexReactClient(convexUrl);
} catch {
  // Convex not available — app falls back to mock data
}

export { convex };

export function useConvexAvailable() {
  return convex !== null;
}

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    return <>{children}</>;
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
