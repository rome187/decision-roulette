User should se all the necessary error messages for conventional login and sign up flows. 
Make sure we follow the best practices for user signup and management. 
Add a profile page for our user to manage their profile.

## Implementation Notes

### Completed Features

1. **Enhanced Error Handling**
   - Server actions now return structured results with field-level and general errors
   - Supabase error codes are mapped to user-friendly messages
   - Field validation includes email format, password strength (8+ chars for signup), and password confirmation matching

2. **Improved Sign-In/Sign-Up UI**
   - Client-side form handling with `useActionState` for real-time feedback
   - Field-level validation errors displayed inline
   - Loading states during form submission
   - Success/error banners with appropriate icons
   - Troubleshooting guidance for users

3. **Profile Management**
   - Migration `002_add_profile_fields.sql` adds `full_name`, `username`, and `avatar_url` fields
   - Profile page at `/profile` allows users to update their information
   - Username validation: 3-30 chars, lowercase alphanumeric with underscores/hyphens
   - Unique username constraint with helpful error messages

4. **Protected Routes**
   - Middleware redirects unauthenticated users to `/signin` with `next` query parameter
   - Original destination is preserved and users are redirected after successful login
   - Profile page is protected and requires authentication

### Testing Checklist

- [ ] Sign up with invalid email format
- [ ] Sign up with weak password (< 8 chars)
- [ ] Sign up with mismatched password confirmation
- [ ] Sign in with incorrect credentials
- [ ] Sign in with unconfirmed email
- [ ] Access protected route while logged out (should redirect to signin)
- [ ] Update profile with invalid username format
- [ ] Update profile with duplicate username
- [ ] Update profile with invalid avatar URL
- [ ] Successfully update profile fields 