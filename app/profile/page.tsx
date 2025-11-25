import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm'
import Link from 'next/link'
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="rounded-lg bg-white px-6 py-8 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Profile Settings
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your account information and preferences
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Back to Home
            </Link>
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

