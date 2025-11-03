import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: string
  bgColor: string
}

export default function QuickActionCard({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color, 
  bgColor 
}: QuickActionCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-red-200">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex items-center text-red-600 text-sm font-medium group-hover:text-red-700">
          <span>Get Started</span>
          <div className="ml-2 w-0 group-hover:w-6 h-0.5 bg-red-600 transition-all duration-300"></div>
        </div>
      </div>
    </Link>
  )
}
