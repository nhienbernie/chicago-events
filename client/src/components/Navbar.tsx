'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import SearchBar from '@/components/SearchBar'
import router from 'next/dist/shared/lib/router/router'

interface NavbarProps {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
  price: string
  setPrice: (v: string) => void
  dateFilter: string
  setDateFilter: (v: string) => void
}



export default function Navbar({
  search, setSearch,
  category, setCategory,
  price, setPrice,
  dateFilter, setDateFilter
}: NavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin() {
    const email = prompt('Enter your email:')
    const password = prompt('Enter your password:')

    if (!email || !password) return

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  async function handleSignUp() {
    const email = prompt('Enter your email:')
    const password = prompt('Enter your password:')
    if (!email || !password) return
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email to confirm your account!')
      router.push('/profile/setup')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <nav style={{ background: 'linear-gradient(135deg, #0D1B4B 0%, #1E3AFF 60%, #6B3FD4 100%)' }} className="sticky top-0 z-50">
      <div className="w-full px-8 h-20 flex items-center gap-4">
        <Link href="/" style={{ color: '#F5F0E8', fontFamily: 'var(--font-playfair), serif', fontSize: '1.75rem' }} className="font-bold shrink-0">
          Chicago Events
        </Link>

        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          price={price}
          setPrice={setPrice}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                  href="/profile"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  My Profile
              </Link>
              
              <Link
                href="/post"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                style={{ 
                  backgroundColor: '#D94F2B', 
                  color: '#FFFFFF', 
                  border: '3px solid #F0A500',
                  fontWeight: 700,
                  fontFamily: 'var(--font-montserrat), sans-serif'
                }}
              >
                + Post Event
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleLogin}
                style={{ backgroundColor: '#D94F2B', color: '#F5F0E8' }}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={handleSignUp}
                style={{ 
                  backgroundColor: '#D94F2B', 
                  color: '#FFFFFF', 
                  border: '3px solid #F0A500',
                  fontWeight: 600,
                  fontFamily: 'var(--font-montserrat), serif'
                }}
                className="text-sm px-4 py-2 rounded-lg hover:bg-white/10"          
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}