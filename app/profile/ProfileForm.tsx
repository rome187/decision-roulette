'use client'

import { updateProfile } from '@/app/actions/profile'
import { useActionState, useEffect } from 'react'

type ProfileFormProps = {
  initialData: {
    email: string
    fullName: string
    username: string
    avatarUrl: string
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
  })

  useEffect(() => {
    if (state.success) {
      // Show success message briefly
      const timer = setTimeout(() => {
        window.location.reload()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.success])

  return (
    <div className="space-y-6">
      {state.success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Profile updated successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {state.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={initialData.email}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm"
            aria-describedby="email-description"
          />
          <p className="mt-1 text-sm text-gray-500" id="email-description">
            Email cannot be changed. Contact support if you need to update your email.
          </p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={initialData.fullName}
            disabled={isPending}
            maxLength={100}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm ${
              state.fieldErrors?.fullName
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter your full name"
            aria-invalid={state.fieldErrors?.fullName ? 'true' : 'false'}
            aria-describedby={
              state.fieldErrors?.fullName
                ? 'fullName-error'
                : 'fullName-description'
            }
          />
          {state.fieldErrors?.fullName ? (
            <p className="mt-1 text-sm text-red-600" id="fullName-error" role="alert">
              {state.fieldErrors.fullName}
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500" id="fullName-description">
              Your display name (optional)
            </p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={initialData.username}
            disabled={isPending}
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_-]+"
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm lowercase ${
              state.fieldErrors?.username
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="username"
            aria-invalid={state.fieldErrors?.username ? 'true' : 'false'}
            aria-describedby={
              state.fieldErrors?.username
                ? 'username-error'
                : 'username-description'
            }
          />
          {state.fieldErrors?.username ? (
            <p className="mt-1 text-sm text-red-600" id="username-error" role="alert">
              {state.fieldErrors.username}
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500" id="username-description">
              3-30 characters, lowercase letters, numbers, underscores, and hyphens only
              (optional)
            </p>
          )}
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            defaultValue={initialData.avatarUrl}
            disabled={isPending}
            maxLength={500}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm ${
              state.fieldErrors?.avatarUrl
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="https://example.com/avatar.jpg"
            aria-invalid={state.fieldErrors?.avatarUrl ? 'true' : 'false'}
            aria-describedby={
              state.fieldErrors?.avatarUrl
                ? 'avatarUrl-error'
                : 'avatarUrl-description'
            }
          />
          {state.fieldErrors?.avatarUrl ? (
            <p className="mt-1 text-sm text-red-600" id="avatarUrl-error" role="alert">
              {state.fieldErrors.avatarUrl}
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500" id="avatarUrl-description">
              URL to your profile picture (optional)
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

