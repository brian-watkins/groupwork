import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs"
import "./globals.css"

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
            <header className="p-4 flex justify-end items-center">
              <div>
                <SignedIn>
                  <UserButton showName={true} />
                </SignedIn>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </ClerkProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
