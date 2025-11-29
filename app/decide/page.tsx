import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Flywheel from '../components/Flywheel'
import HamburgerMenu from '../components/HamburgerMenu'

export default async function DecidePage() {
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin?next=/decide')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex justify-end mb-8">
          <HamburgerMenu />
        </div>

        {/* Flywheel Component */}
        <Flywheel />
      </div>
    </div>
  )
}

