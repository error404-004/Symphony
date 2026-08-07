import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fmdszvxwsjwrcqwandeb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Nb5l5MRvPA9V539-IKvmQw_sJ6DIc2D'

export const isSupabaseConfigured = true

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
