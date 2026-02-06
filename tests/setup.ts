import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase client
vi.mock('../services/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id', email: 'test@example.com' } }
            }),
            getSession: vi.fn().mockResolvedValue({
                data: { session: null }
            }),
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } }
            })),
            updateUser: vi.fn(),
            resetPasswordForEmail: vi.fn()
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: null }),
                    order: vi.fn().mockResolvedValue({ data: [], error: null })
                })),
                order: vi.fn().mockResolvedValue({ data: [], error: null })
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: { tracking_number: 'PFX-12345678' }, error: null })
                }))
            })),
            update: vi.fn(() => ({
                eq: vi.fn().mockResolvedValue({ error: null })
            })),
            delete: vi.fn(() => ({
                eq: vi.fn().mockResolvedValue({ error: null })
            }))
        }))
    },
    isSupabaseConfigured: true
}))

// Mock import.meta.env
vi.stubGlobal('import.meta', {
    env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key'
    }
})
