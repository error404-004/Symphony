import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-symphony-supabase.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Sign up a new user with Email, Password, and Profile metadata
 */
export async function signUpWithEmail(email, password, metadata = {}) {
  if (!isSupabaseConfigured) {
    return {
      data: {
        user: {
          id: 'demo_' + Date.now(),
          email,
          user_metadata: metadata,
        },
      },
      error: null,
    }
  }

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
}

/**
 * Sign in an existing user with Email & Password
 */
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    return {
      data: {
        user: {
          id: 'demo_user',
          email,
          user_metadata: { name: email.split('@')[0] || 'User' },
        },
      },
      error: null,
    }
  }

  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  if (!isSupabaseConfigured) {
    return { error: null }
  }

  return await supabase.auth.signOut()
}

/**
 * Get current session user profile
 */
export async function getSupabaseUser() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}
