'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        return
      }

      if (!data.user) {
        setError('로그인에 실패했습니다.')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single()

      if (profileError || !profile) {
        setError('프로필 정보를 불러올 수 없습니다.')
        await supabase.auth.signOut()
        return
      }

      if (profile.role !== 'trainer') {
        setError('접근 권한이 없습니다. 트레이너 계정으로 로그인해주세요.')
        await supabase.auth.signOut()
        return
      }

      router.push('/dashboard')
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1117' }}>
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00E5A0' }}>
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold text-white">그린짐</span>
          </div>
          <p style={{ color: '#8B8FA8' }}>경영 대시보드</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E' }}>
          <h1 className="text-xl font-semibold text-white mb-6">트레이너 로그인</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#8B8FA8' }}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-white outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: '#1A1D27',
                  border: '1px solid #2A2D3E',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00E5A0'}
                onBlur={(e) => e.target.style.borderColor = '#2A2D3E'}
                placeholder="trainer@greengym.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#8B8FA8' }}>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-white outline-none transition-all"
                style={{
                  backgroundColor: '#1A1D27',
                  border: '1px solid #2A2D3E',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00E5A0'}
                onBlur={(e) => e.target.style.borderColor = '#2A2D3E'}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#FF4D4D20', color: '#FF4D4D', border: '1px solid #FF4D4D40' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-black transition-all mt-2"
              style={{
                backgroundColor: loading ? '#00B880' : '#00E5A0',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
