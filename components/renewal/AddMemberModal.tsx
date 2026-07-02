'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Program, RenewalMember } from '@/lib/types'

const PROGRAMS: Program[] = ['블로그체험단', '1:1 PT', '요가', '그룹PT', '구독', '헬스']

interface AddMemberModalProps {
  onClose: () => void
  onAdded: (member: RenewalMember) => void
  targetMonth: string
}

export default function AddMemberModal({ onClose, onAdded, targetMonth }: AddMemberModalProps) {
  const [form, setForm] = useState({
    member_name: '',
    program: '헬스' as Program,
    expire_date: '',
    last_visit_date: '',
    total_visits: 0,
    memo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.member_name || !form.expire_date) {
      setError('이름과 만료일은 필수입니다.')
      return
    }
    setLoading(true)

    const { data, error: insertError } = await supabase
      .from('renewal_tracking')
      .insert({
        member_name: form.member_name,
        program: form.program,
        expire_date: form.expire_date,
        last_visit_date: form.last_visit_date || null,
        total_visits: form.total_visits,
        memo: form.memo || null,
        target_month: targetMonth,
        renewal_probability: 50,
        contacted_kakao: false,
        contacted_sms: false,
        contacted_call: false,
        contacted_visit: false,
      })
      .select()
      .single()

    setLoading(false)
    if (insertError) {
      setError('저장 중 오류가 발생했습니다.')
      return
    }
    onAdded(data as RenewalMember)
    onClose()
  }

  const inputStyle = {
    backgroundColor: '#1A1D27',
    border: '1px solid #2A2D3E',
    color: '#FFFFFF',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: '#00000080' }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">회원 추가</h2>
          <button onClick={onClose} style={{ color: '#8B8FA8' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B8FA8' }}>이름 *</label>
            <input
              type="text"
              value={form.member_name}
              onChange={(e) => setForm({ ...form, member_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle}
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B8FA8' }}>프로그램</label>
            <select
              value={form.program}
              onChange={(e) => setForm({ ...form, program: e.target.value as Program })}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle}
            >
              {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B8FA8' }}>만료일 *</label>
              <input
                type="date"
                value={form.expire_date}
                onChange={(e) => setForm({ ...form, expire_date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8B8FA8' }}>마지막 방문일</label>
              <input
                type="date"
                value={form.last_visit_date}
                onChange={(e) => setForm({ ...form, last_visit_date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B8FA8' }}>누적 방문 횟수</label>
            <input
              type="number"
              min={0}
              value={form.total_visits}
              onChange={(e) => setForm({ ...form, total_visits: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8B8FA8' }}>메모</label>
            <textarea
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>

          {error && <p className="text-xs" style={{ color: '#FF4D4D' }}>{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#1A1D27', color: '#8B8FA8', border: '1px solid #2A2D3E' }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black"
              style={{ backgroundColor: '#00E5A0', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '저장 중...' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
