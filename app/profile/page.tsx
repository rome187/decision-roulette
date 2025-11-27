import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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

