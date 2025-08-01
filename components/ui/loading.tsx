import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function Loading({ message = "Loading...", size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className="flex items-center justify-center gap-2 text-gray-400">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      <span className="text-sm">{message}</span>
    </div>
  )
}

export function LoadingRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-3">
        <div className="w-4 h-4 bg-gray-700 rounded"></div>
      </td>
      <td className="py-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-700 rounded mr-3"></div>
          <div className="w-32 h-4 bg-gray-700 rounded"></div>
        </div>
      </td>
      <td className="py-3">
        <div className="w-24 h-4 bg-gray-700 rounded"></div>
      </td>
      <td className="py-3">
        <div className="w-20 h-4 bg-gray-700 rounded"></div>
      </td>
      <td className="py-3">
        <div className="w-16 h-4 bg-gray-700 rounded"></div>
      </td>
    </tr>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white/5 p-4 rounded-lg animate-pulse">
      <div className="flex items-center mb-2">
        <div className="w-4 h-4 bg-gray-700 rounded mr-2"></div>
        <div className="w-10 h-10 bg-gray-700 rounded mr-3"></div>
        <div className="w-32 h-4 bg-gray-700 rounded"></div>
      </div>
      <div className="ml-8 pl-3 space-y-2">
        <div className="w-24 h-3 bg-gray-700 rounded"></div>
        <div className="w-20 h-3 bg-gray-700 rounded"></div>
        <div className="w-16 h-3 bg-gray-700 rounded"></div>
      </div>
    </div>
  )
} 