// src/components/charts/TopCategoriesChart.tsx
'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Education',      value: 32 },
  { name: 'Medical',        value: 24 },
  { name: 'Disaster Relief',value: 18 },
  { name: 'Community',      value: 12 },
  { name: 'Environment',    value: 9  },
  { name: 'Animal Welfare', value: 5  },
]

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="font-medium text-slate-700 mb-0.5">{payload[0].name}</p>
        <p className="text-slate-500">{payload[0].value}% of donations</p>
      </div>
    )
  }
  return null
}

const renderLegend = (props: any) => {
  const { payload } = props
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-slate-600">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TopCategoriesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}