// components/StatsCard.tsx
import React from 'react'

interface StatsCardProps {
  label: string
  value: string
  percentage: string
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, percentage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-medium text-gray-700">{label}</h3>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{percentage}</p>
    </div>
  )
}

export default StatsCard
