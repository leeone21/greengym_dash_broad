interface WeekTabsProps {
  activeTab: number
  onTabChange: (tab: number) => void
  counts: Record<number, number>
  total: number
}

export default function WeekTabs({ activeTab, onTabChange, counts, total }: WeekTabsProps) {
  const tabs = [
    { id: 0, label: '전체' },
    { id: 1, label: '1주차' },
    { id: 2, label: '2주차' },
    { id: 3, label: '3주차' },
    { id: 4, label: '4주차' },
  ]

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const count = tab.id === 0 ? total : (counts[tab.id] ?? 0)
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: isActive ? '#00E5A015' : '#1E2130',
              color: isActive ? '#00E5A0' : '#8B8FA8',
              border: `1px solid ${isActive ? '#00E5A040' : '#2A2D3E'}`,
            }}
          >
            {tab.label}
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: isActive ? '#00E5A030' : '#2A2D3E',
                color: isActive ? '#00E5A0' : '#8B8FA8',
              }}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
