'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const SAMPLE_DATA = [
  { month: '2월', 헬스: 1200000, 요가: 800000, 그룹PT: 600000, PT: 1500000, 구독: 300000 },
  { month: '3월', 헬스: 1350000, 요가: 850000, 그룹PT: 650000, PT: 1600000, 구독: 320000 },
  { month: '4월', 헬스: 1280000, 요가: 900000, 그룹PT: 700000, PT: 1700000, 구독: 350000 },
  { month: '5월', 헬스: 1400000, 요가: 950000, 그룹PT: 720000, PT: 1800000, 구독: 380000 },
  { month: '6월', 헬스: 1500000, 요가: 1000000, 그룹PT: 750000, PT: 1900000, 구독: 400000 },
  { month: '7월', 헬스: 1600000, 요가: 1100000, 그룹PT: 800000, PT: 2000000, 구독: 420000 },
]

const COLORS = {
  헬스: '#00E5A0',
  요가: '#00B880',
  그룹PT: '#0088FF',
  PT: '#FF6B35',
  구독: '#A855F7',
}

export default function RevenueChart() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E' }}
    >
      <h3 className="font-semibold text-white mb-6">월별 매출 현황</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={SAMPLE_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" />
          <XAxis dataKey="month" tick={{ fill: '#8B8FA8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#8B8FA8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2D3E', borderRadius: '8px', color: '#FFFFFF' }}
            formatter={(value: number) => [`${value.toLocaleString()}원`, '']}
          />
          <Legend wrapperStyle={{ color: '#8B8FA8', fontSize: 12 }} />
          {Object.entries(COLORS).map(([key, color]) => (
            <Bar key={key} dataKey={key} stackId="a" fill={color} radius={key === '구독' ? [4, 4, 0, 0] as [number, number, number, number] : [0, 0, 0, 0] as [number, number, number, number]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
