'use server'

import { revalidatePath } from 'next/cache'
import { createServerComponentClient } from '@/lib/supabase/server'
import { db, isDatabaseAvailable } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq, and, ne } from 'drizzle-orm'

export type ProfileResult = {
  success: boolean
  error?: string
  fieldErrors?: {
    fullName?: string
    username?: string
    avatarUrl?: string
  }
}

function validateUsername(username: string | null | undefined): string | null {
  if (!username || username.trim() === '') {
    return null // Username is optional
  }
  
  const trimmed = username.trim().toLowerCase()
  
  if (trimmed.length < 3) {
    return 'Username must be at least 3 characters long'
  }
  
  if (trimmed.length > 30) {
    return 'Username must be no more than 30 characters long'
  }
  
  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return 'Username can only contain lowercase letters, numbers, underscores, and hyphens'
  }
  
  return null
}

function validateFullName(fullName: string | null | undefined): string | null {
  if (!fullName || fullName.trim() === '') {
    return null // Full name is optional
  }
  
  const trimmed = fullName.trim()
  
  if (trimmed.length > 100) {
    return 'Full name must be no more than 100 characters long'
  }
  
  return null
}

function validateAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl || avatarUrl.trim() === '') {
    return null // Avatar URL is optional
  }
  
  const trimmed = avatarUrl.trim()
  
  try {
    new URL(trimmed)
  } catch {
    return 'Please enter a valid URL'
  }
  
  if (trimmed.length > 500) {
    return 'Avatar URL must be no more than 500 characters long'
  }
  
  return null
}

export async function updateProfile(
  prevState: ProfileResult | null,
  formData: FormData
): Promise<ProfileResult> {
  const supabase = await createServerComponentClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to update your profile',
    }
  }

  const fullName = formData.get('fullName') as string | null
  const username = formData.get('username') as string | null
  const avatarUrl = formData.get('avatarUrl') as string | null

  const fieldErrors: ProfileResult['fieldErrors'] = {}

  // Validate fields
  const fullNameError = validateFullName(fullName)
  if (fullNameError) {
    fieldErrors.fullName = fullNameError
  }

  const usernameError = validateUsername(username)
  if (usernameError) {
    fieldErrors.username = usernameError
  }

  const avatarUrlError = validateAvatarUrl(avatarUrl)
  if (avatarUrlError) {
    fieldErrors.avatarUrl = avatarUrlError
  }

  // Return early if there are validation errors
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    }
  }

  // Prepare update data
  const updateData: {
    fullName?: string | null
    username?: string | null
    avatarUrl?: string | null
  } = {}

  if (fullName !== null) {
    updateData.fullName = fullName?.trim() || null
  }
  if (username !== null) {
    updateData.username = username?.trim().toLowerCase() || null
  }
  if (avatarUrl !== null) {
    updateData.avatarUrl = avatarUrl?.trim() || null
  }

  // Check if database is available
  if (!isDatabaseAvailable()) {
    return {
      success: false,
      error: 'Database is not configured. Please set DATABASE_URL environment variable.',
    }
  }

  // Check if username is already taken (if provided)
  if (updateData.username) {
    try {
      const existingProfiles = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(
          and(
            eq(profiles.username, updateData.username),
            ne(profiles.id, user.id)
          )
        )
        .limit(1)

      if (existingProfiles.length > 0) {
        return {
          success: false,
          fieldErrors: {
            username: 'This username is already taken',
          },
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to check username availability. Please try again.',
      }
    }
  }

  // Update profile
  try {
    await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, user.id))
  } catch (error: any) {
    // Handle unique constraint violation
    if (error?.code === '23505' && error?.message?.includes('username')) {
      return {
        success: false,
        fieldErrors: {
          username: 'This username is already taken',
        },
      }
    }

    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    }
  }

  revalidatePath('/profile', 'layout')
  revalidatePath('/', 'layout')
  
  return {
    success: true,
  }
}

