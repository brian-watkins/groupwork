import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs"
import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <Link href="/courses">View Courses</Link>
            <SignOutButton></SignOutButton>
          </SignedIn>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}