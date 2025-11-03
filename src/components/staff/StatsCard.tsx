import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor,
  change 
}: StatsCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
          {change && (
            <p className={`text-sm ${getChangeColor(change.type)}`}>
              {change.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}
