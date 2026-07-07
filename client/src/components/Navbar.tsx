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
    <nav style={{ backgroundColor: '#1A1A2E' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" style={{ color: '#E8A838' }} className="font-bold text-xl shrink-0">
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                className="text-sm px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Sign in
              </button>
              <button
                onClick={handleSignUp}
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
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