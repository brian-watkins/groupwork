import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to GroupWork
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The smart way to organize students into effective learning groups.
          Create balanced teams, track progress, and help students collaborate
          better.
        </p>

        <div className="mt-10">
          <SignedIn>
            <Link
              href="/courses"
              className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Courses
            </Link>
          </SignedIn>

          <SignedOut>
            <div className="flex gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="px-6 py-3 text-lg font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
