interface StatCardProps {
  label: string
  value: string
  sub?: string
  color?: 'green' | 'amber' | 'blue' | 'red' | 'white'
}

export function StatCard({ label, value, sub, color = 'white' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className={`stat-card__value ${color}`}>{value}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  )
}
