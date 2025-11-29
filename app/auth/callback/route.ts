import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/profile'

  // Create a response object for redirect
  let redirectResponse = NextResponse.redirect(new URL(next, requestUrl.origin))

  if (code) {
    // Create Supabase client with Route Handler cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Update request cookies
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
            // Recreate redirect response to ensure cookies are properly handled
            redirectResponse = NextResponse.redirect(new URL(next, requestUrl.origin))
            // Set cookies on the response
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to signin with error message
      const errorUrl = new URL('/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'Failed to confirm email. Please try again.')
      return NextResponse.redirect(errorUrl)
    }

    // Verify session was successfully created
    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    
    if (getUserError || !user) {
      console.error('Error verifying session after email confirmation:', getUserError)
      // Redirect to signin with error message
      const errorUrl = new URL('/signin', requestUrl.origin)
      errorUrl.searchParams.set('error', 'Failed to establish session. Please try signing in.')
      return NextResponse.redirect(errorUrl)
    }
  }

  // Return redirect response with cookies properly set
  return redirectResponse
}

