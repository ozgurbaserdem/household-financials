interface CalculatorCardProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}

export function CalculatorCard({
  title,
  description,
  icon,
  children,
}: CalculatorCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
} 