interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  accent?: boolean
}

export default function StatCard({ title, value, subtitle, accent }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-6 transition-all"
      style={{
        backgroundColor: '#1E2130',
        border: `1px solid ${accent ? '#00E5A040' : '#2A2D3E'}`,
      }}
    >
      <p className="text-sm mb-2" style={{ color: '#8B8FA8' }}>{title}</p>
      <p
        className="text-3xl font-bold"
        style={{ color: accent ? '#00E5A0' : '#FFFFFF' }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: '#8B8FA8' }}>{subtitle}</p>
      )}
    </div>
  )
}
