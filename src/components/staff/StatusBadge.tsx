import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          iconColor: "text-green-500"
        }
      case "CANCELLED":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800",
          iconColor: "text-red-500"
        }
      case "PENDING":
        return {
          icon: AlertCircle,
          color: "bg-yellow-100 text-yellow-800",
          iconColor: "text-yellow-500"
        }
      case "APPROVED":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          iconColor: "text-green-500"
        }
      case "REJECTED":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800",
          iconColor: "text-red-500"
        }
      default:
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800",
          iconColor: "text-gray-500"
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className={`h-3 w-3 mr-1 ${config.iconColor}`} />
      {status}
    </span>
  )
}
