'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase/server'

export type AuthResult = {
  success: boolean
  codeSent?: boolean
  email?: string
  error?: string
  fieldErrors?: {
    email?: string
    password?: string
    confirmPassword?: string
    code?: string
  }
}

function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address'
  }
  return null
}

function validatePassword(password: string, isSignUp: boolean = false): string | null {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long'
  }
  if (isSignUp && password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  return null
}

function mapSupabaseError(error: { message: string; status?: number }): string {
  const message = error.message.toLowerCase()
  
  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }
  if (message.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.'
  }
  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }
  if (message.includes('password')) {
    return 'Password does not meet requirements. Please use a stronger password.'
  }
  if (message.includes('email')) {
    return 'Please enter a valid email address.'
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (message.includes('invalid otp') || message.includes('invalid code') || message.includes('token')) {
    return 'Invalid verification code. Please check the code and try again.'
  }
  if (message.includes('expired') || message.includes('expire')) {
    return 'Verification code has expired. Please request a new code.'
  }
  if (message.includes('otp') || message.includes('verification')) {
    return 'Verification failed. Please try again.'
  }
  
  return error.message || 'An unexpected error occurred. Please try again.'
}

export async function signUp(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createServerComponentClient()

  const email = formData.get('email') as string

  const fieldErrors: AuthResult['fieldErrors'] = {}

  // Validate email
  const emailError = validateEmail(email)
  if (emailError) {
    fieldErrors.email = emailError
  }

  // Return early if there are validation errors
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: true,
    },
  })

  if (error) {
    return {
      success: false,
      error: mapSupabaseError(error),
    }
  }

  return {
    success: true,
    codeSent: true,
    email: email.trim(),
  }
}

export async function verifyOtpCode(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createServerComponentClient()

  const email = formData.get('email') as string
  const code = formData.get('code') as string

  const fieldErrors: AuthResult['fieldErrors'] = {}

  // Validate email
  const emailError = validateEmail(email)
  if (emailError) {
    fieldErrors.email = emailError
  }

  // Validate code
  if (!code) {
    fieldErrors.code = 'Verification code is required'
  } else if (!/^\d{6}$/.test(code.trim())) {
    fieldErrors.code = 'Verification code must be 6 digits'
  }

  // Return early if there are validation errors
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      codeSent: true,
      email: email,
      fieldErrors,
    }
  }

  const { error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: code.trim(),
    type: 'email',
  })

  if (error) {
    return {
      success: false,
      codeSent: true,
      email: email.trim(),
      error: mapSupabaseError(error),
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
  }
}

export async function signIn(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createServerComponentClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const fieldErrors: AuthResult['fieldErrors'] = {}

  // Validate email
  const emailError = validateEmail(email)
  if (emailError) {
    fieldErrors.email = emailError
  }

  // Validate password
  const passwordError = validatePassword(password, false)
  if (passwordError) {
    fieldErrors.password = passwordError
  }

  // Return early if there are validation errors
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password,
  })

  if (error) {
    return {
      success: false,
      error: mapSupabaseError(error),
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
  }
}

export async function signOut() {
  const supabase = await createServerComponentClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/signin')
}

