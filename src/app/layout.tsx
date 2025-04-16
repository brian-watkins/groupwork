import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
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
          <div className="min-h-screen">
            <header className="p-4 flex justify-between items-center">
              <div>
                <SignedIn>
                  <Link href="/courses" className="font-medium">
                    View Courses
                  </Link>
                </SignedIn>
              </div>
              <div>
                <SignedOut>
                  <div className="flex gap-4">
                    <SignInButton />
                    <SignUpButton />
                  </div>
                </SignedOut>
                <SignedIn>
                  <UserButton showName={true} />
                </SignedIn>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  )
}
