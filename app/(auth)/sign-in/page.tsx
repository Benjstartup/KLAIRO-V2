import type { Metadata } from "next";
import { signIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  async function handleGitHubSignIn() {
    "use server";
    await signIn("github", { redirectTo: "/workspace" });
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / wordmark */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Klairo
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Trader workflow platform for US equities
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-300 mb-5 font-medium">
            Sign in to your workspace
          </p>

          <form action={handleGitHubSignIn}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 bg-white text-gray-900 rounded-md py-2.5 text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
            >
              <GitHubIcon />
              Continue with GitHub
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-5 text-center">
            More sign-in options coming soon
          </p>
        </div>

        <p className="text-xs text-gray-700 text-center mt-6">
          By signing in you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}
