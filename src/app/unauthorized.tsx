import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h1 className="text-4xl font-bold mb-4">401 - Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-6">
        You can&apos;t do that.
      </p>
      <Link 
        href="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
      >
        Return Home
      </Link>
    </div>
  )
}