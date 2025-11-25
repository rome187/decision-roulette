import { createServerComponentClient } from '@/lib/supabase/server'
import { SignOutButton } from './components/SignOutButton'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db, isDatabaseAvailable } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function Home() {
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome to Decision Roulette
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Sign in or create an account to get started
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signin"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get user profile
  let profile = null
  try {
    if (isDatabaseAvailable()) {
      const profileResults = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1)
      
      profile = profileResults[0] || null
    }
  } catch (error) {
    // Database not available or error occurred - continue without profile data
    console.error('Failed to fetch profile:', error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="rounded-lg bg-white px-6 py-8 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Welcome back!
              </h1>
              <p className="mt-2 text-gray-600">You are successfully signed in.</p>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              <Link
                href="/profile"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Edit Profile →
              </Link>
            </div>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              {profile?.fullName && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.fullName}</dd>
                </div>
              )}
              {profile?.username && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900">@{profile.username}</dd>
                </div>
              )}
              {profile && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Profile Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
