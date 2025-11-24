import { signOut } from '@/app/actions/auth'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Sign out
      </button>
    </form>
  )
}

