import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProfileForm } from './ProfileForm'
import HamburgerMenu from '../components/HamburgerMenu'
import { db, isDatabaseAvailable } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function ProfilePage() {
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin?next=/profile')
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
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex justify-end">
          <HamburgerMenu />
        </div>

        {/* Profile Information Display */}
        <div className="rounded-lg bg-white px-6 py-8 shadow-md">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Profile Information
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage your account information
            </p>
          </div>

          <dl className="space-y-4">
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

        {/* Continue Button */}
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 shadow-md">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Ready to Make Decisions?
            </h2>
            <p className="text-blue-100">
              Use the Decision Roulette to randomly select from your options
            </p>
            <Link
              href="/decide"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all hover:scale-105"
            >
              Continue to Decision Roulette
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="rounded-lg bg-white px-6 py-8 shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Edit Profile
            </h2>
            <p className="mt-2 text-gray-600">
              Update your account information and preferences
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <ProfileForm
              initialData={{
                email: user.email || '',
                fullName: profile?.fullName || '',
                username: profile?.username || '',
                avatarUrl: profile?.avatarUrl || '',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

