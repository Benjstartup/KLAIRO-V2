import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Root page — redirects based on auth state.
 * Authenticated users go to the workspace.
 * Unauthenticated users go to sign-in.
 */
export default async function RootPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/workspace");
  }
  redirect("/sign-in");
}
