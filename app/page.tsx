import { createServerComponentClient } from '@/lib/supabase/server'
import { SignOutButton } from './components/SignOutButton'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
              </div>
              {profile && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Profile Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString()}
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
