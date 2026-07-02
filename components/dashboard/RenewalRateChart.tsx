'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const SAMPLE_DATA = [
  { month: '2월', rate: 65 },
  { month: '3월', rate: 72 },
  { month: '4월', rate: 68 },
  { month: '5월', rate: 75 },
  { month: '6월', rate: 80 },
  { month: '7월', rate: 78 },
]

export default function RenewalRateChart() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#1E2130', border: '1px solid #2A2D3E' }}
    >
      <h3 className="font-semibold text-white mb-6">재등록률 트렌드</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={SAMPLE_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" />
          <XAxis dataKey="month" tick={{ fill: '#8B8FA8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#8B8FA8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A1D27', border: '1px solid #2A2D3E', borderRadius: '8px', color: '#FFFFFF' }}
            formatter={(value: number) => [`${value}%`, '재등록률']}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#00E5A0"
            strokeWidth={2.5}
            dot={{ fill: '#00E5A0', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
