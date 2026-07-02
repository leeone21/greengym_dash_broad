'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { RenewalMember } from '@/lib/types'
import WeekTabs from './WeekTabs'
import MemberCard from './MemberCard'
import AddMemberModal from './AddMemberModal'
import * as XLSX from 'xlsx'

function getWeekOfMonth(dateStr: string): number {
  const date = new Date(dateStr)
  return Math.ceil(date.getDate() / 7)
}

interface KakaoModalProps {
  members: RenewalMember[]
  onClose: () => void
}

function KakaoModal({ members, onClose }: KakaoModalProps) {
  const highProb = members.filter((m) => m.renewal_probability >= 70)
  const [copied, setCopied] = useState<string | null>(null)

  const getTemplate = (m: RenewalMember) =>
    `안녕하세요 ${m.member_name}님 😊\n이번 달 ${m.expire_date}에 회원권이 만료됩니다.\n재등록 문의는 카운터로 편하게 말씀해 주세요!`

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: '#00000080' }}>
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">카카오 메시지 템플릿</h2>
            <p className="text-xs mt-0.5" style={{ color: '#8B8FA8' }}>
              재등록 확률 70% 이상 회원 ({highProb.length}명)
            </p>
          </div>
          <button onClick={onClose} style={{ color: '#8B8FA8' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {highProb.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: '#8B8FA8' }}>
              재등록 확률 70% 이상 회원이 없습니다.
            </p>
          ) : (
            highProb.map((m) => {
              const text = getTemplate(m)
              return (
                <div
                  key={m.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: '#1A1D27', border: '1px solid #2A2D3E' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{m.member_name}</span>
                    <span className="text-xs" style={{ color: '#00E5A0' }}>{m.renewal_probability}%</span>
                  </div>
                  <pre
                    className="text-xs whitespace-pre-wrap mb-3"
                    style={{ color: '#8B8FA8', fontFamily: 'inherit' }}
                  >
                    {text}
                  </pre>
                  <button
                    onClick={() => handleCopy(m.id, text)}
                    className="w-full py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: copied === m.id ? '#00E5A015' : '#2A2D3E',
                      color: copied === m.id ? '#00E5A0' : '#8B8FA8',
                    }}
                  >
                    {copied === m.id ? '✓ 복사됨' : '클립보드 복사'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default function RenewalBoard() {
  const [members, setMembers] = useState<RenewalMember[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showKakaoModal, setShowKakaoModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const targetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('renewal_tracking')
      .select('*')
      .eq('target_month', targetMonth)
      .order('expire_date', { ascending: true })
    setMembers((data as RenewalMember[]) ?? [])
    setLoading(false)
  }, [targetMonth])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const weekCounts = members.reduce((acc, m) => {
    const w = getWeekOfMonth(m.expire_date)
    acc[w] = (acc[w] ?? 0) + 1
    return acc
  }, {} as Record<number, number>)

  const filteredMembers = activeTab === 0
    ? members
    : members.filter((m) => getWeekOfMonth(m.expire_date) === activeTab)

  const handleExport = () => {
    const rows = filteredMembers.map((m) => ({
      이름: m.member_name,
      프로그램: m.program,
      만료일: m.expire_date,
      마지막방문: m.last_visit_date ?? '',
      누적방문: m.total_visits,
      재등록확률: `${m.renewal_probability}%`,
      연락방법: [
        m.contacted_kakao && '카톡',
        m.contacted_sms && '문자',
        m.contacted_call && '전화',
        m.contacted_visit && '방문',
      ]
        .filter(Boolean)
        .join(', '),
      메모: m.memo ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '재등록관리')
    XLSX.writeFile(wb, `재등록관리_${targetMonth}.xlsx`)
  }

  const avgProb =
    members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.renewal_probability, 0) / members.length)
      : 0

  const contactSummary = {
    kakao: members.filter((m) => m.contacted_kakao).length,
    sms: members.filter((m) => m.contacted_sms).length,
    call: members.filter((m) => m.contacted_call).length,
    visit: members.filter((m) => m.contacted_visit).length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">재등록 관리</h1>
          <p className="mt-1 text-sm" style={{ color: '#8B8FA8' }}>{targetMonth} 만료 예정 회원</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowKakaoModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#1E2130', color: '#8B8FA8', border: '1px solid #2A2D3E' }}
          >
            💬 카카오 템플릿
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#1E2130', color: '#8B8FA8', border: '1px solid #2A2D3E' }}
          >
            📊 엑셀 내보내기
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-black"
            style={{ backgroundColor: '#00E5A0' }}
          >
            + 회원 추가
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center gap-6 flex-wrap"
        style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E' }}
      >
        <div>
          <span className="text-xs" style={{ color: '#8B8FA8' }}>전체 대상</span>
          <span className="ml-2 font-semibold text-white">{members.length}명</span>
        </div>
        <div className="h-4 w-px" style={{ backgroundColor: '#2A2D3E' }} />
        <div className="flex gap-4 text-sm">
          <span style={{ color: '#8B8FA8' }}>카톡 <span className="text-white">{contactSummary.kakao}명</span></span>
          <span style={{ color: '#8B8FA8' }}>문자 <span className="text-white">{contactSummary.sms}명</span></span>
          <span style={{ color: '#8B8FA8' }}>전화 <span className="text-white">{contactSummary.call}명</span></span>
          <span style={{ color: '#8B8FA8' }}>방문 <span className="text-white">{contactSummary.visit}명</span></span>
        </div>
        <div className="ml-auto">
          <span className="text-xs" style={{ color: '#8B8FA8' }}>평균 재등록 확률</span>
          <span className="ml-2 font-semibold" style={{ color: '#00E5A0' }}>{avgProb}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <WeekTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={weekCounts}
          total={members.length}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: '#2A2D3E', borderTopColor: '#00E5A0' }}
          />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: '#8B8FA8' }}>이번 달 만료 예정 회원이 없습니다.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-black"
            style={{ backgroundColor: '#00E5A0' }}
          >
            + 회원 추가
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onDelete={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
              onUpdate={(updated) =>
                setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
              }
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdded={(m) => setMembers((prev) => [...prev, m])}
          targetMonth={targetMonth}
        />
      )}

      {showKakaoModal && (
        <KakaoModal members={members} onClose={() => setShowKakaoModal(false)} />
      )}
    </div>
  )
}
