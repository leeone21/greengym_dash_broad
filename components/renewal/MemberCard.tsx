'use client'

import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { RenewalMember } from '@/lib/types'

interface MemberCardProps {
  member: RenewalMember
  onDelete: (id: string) => void
  onUpdate: (member: RenewalMember) => void
}

function getExpiryStatus(expireDate: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expire = new Date(expireDate)
  const diffDays = Math.floor((expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: '만료됨', color: '#FF4D4D', bg: '#FF4D4D20' }
  if (diffDays <= 5) return { label: `D-${diffDays}`, color: '#FFB020', bg: '#FFB02020' }
  return { label: `D-${diffDays}`, color: '#00E5A0', bg: '#00E5A020' }
}

export default function MemberCard({ member, onDelete, onUpdate }: MemberCardProps) {
  const [local, setLocal] = useState(member)
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const status = getExpiryStatus(local.expire_date)

  const save = useCallback(async (updated: RenewalMember) => {
    setSaving(true)
    await supabase
      .from('renewal_tracking')
      .update({
        renewal_probability: updated.renewal_probability,
        contacted_kakao: updated.contacted_kakao,
        contacted_sms: updated.contacted_sms,
        contacted_call: updated.contacted_call,
        contacted_visit: updated.contacted_visit,
        memo: updated.memo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updated.id)
    setSaving(false)
    onUpdate(updated)
  }, [onUpdate])

  const handleChange = (field: keyof RenewalMember, value: unknown) => {
    const updated = { ...local, [field]: value } as RenewalMember
    setLocal(updated)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(updated), 500)
  }

  const handleDelete = async () => {
    if (!confirm(`${local.member_name}님을 삭제하시겠습니까?`)) return
    const { error } = await supabase.from('renewal_tracking').delete().eq('id', local.id)
    if (!error) onDelete(local.id)
  }

  const contactButtons = [
    { field: 'contacted_kakao' as const, label: '카톡', icon: '💬' },
    { field: 'contacted_sms' as const, label: '문자', icon: '📱' },
    { field: 'contacted_call' as const, label: '전화', icon: '📞' },
    { field: 'contacted_visit' as const, label: '방문', icon: '🏃' },
  ]

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{local.member_name}</h3>
            {saving && <span className="text-xs" style={{ color: '#8B8FA8' }}>저장 중...</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#00E5A015', color: '#00E5A0' }}>
              {local.program}
            </span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>
        <button onClick={handleDelete} style={{ color: '#8B8FA8' }} title="삭제">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs" style={{ color: '#8B8FA8' }}>
        <div>
          <div className="mb-0.5">만료일</div>
          <div className="text-white font-medium">{local.expire_date}</div>
        </div>
        <div>
          <div className="mb-0.5">마지막 방문</div>
          <div className="text-white font-medium">{local.last_visit_date ?? '-'}</div>
        </div>
        <div>
          <div className="mb-0.5">누적 방문</div>
          <div className="text-white font-medium">{local.total_visits}회</div>
        </div>
      </div>

      {/* Probability */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: '#8B8FA8' }}>재등록 확률</span>
          <span style={{ color: '#00E5A0', fontWeight: 600 }}>{local.renewal_probability}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={local.renewal_probability}
          onChange={(e) => handleChange('renewal_probability', parseInt(e.target.value))}
          style={{
            width: '100%',
            background: `linear-gradient(to right, #00E5A0 ${local.renewal_probability}%, #2A2D3E ${local.renewal_probability}%)`,
          }}
        />
      </div>

      {/* Contact buttons */}
      <div className="flex gap-1.5 mb-4">
        {contactButtons.map(({ field, label, icon }) => {
          const active = local[field] as boolean
          return (
            <button
              key={field}
              onClick={() => handleChange(field, !active)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? '#00E5A015' : '#1A1D27',
                color: active ? '#00E5A0' : '#8B8FA8',
                border: `1px solid ${active ? '#00E5A040' : '#2A2D3E'}`,
              }}
            >
              {icon} {label}
            </button>
          )
        })}
      </div>

      {/* Memo */}
      <textarea
        value={local.memo ?? ''}
        onChange={(e) => handleChange('memo', e.target.value)}
        placeholder="메모 입력..."
        rows={2}
        className="w-full text-xs rounded-lg px-3 py-2 resize-none outline-none"
        style={{ backgroundColor: '#1A1D27', border: '1px solid #2A2D3E', color: '#FFFFFF' }}
      />
    </div>
  )
}
