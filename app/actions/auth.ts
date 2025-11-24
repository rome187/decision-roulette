'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createServerComponentClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    return
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signIn(formData: FormData) {
  const supabase = await createServerComponentClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    redirect(`/signin?error=${encodeURIComponent(error.message)}`)
    return
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createServerComponentClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/signin')
}

