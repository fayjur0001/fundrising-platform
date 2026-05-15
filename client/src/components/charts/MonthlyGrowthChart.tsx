// src/components/charts/MonthlyGrowthChart.tsx
'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatBDT } from '@/lib/utils'

const data = [
  { month: 'Jun',  total: 85000  },
  { month: 'Jul',  total: 112000 },
  { month: 'Aug',  total: 98000  },
  { month: 'Sep',  total: 145000 },
  { month: 'Oct',  total: 167000 },
  { month: 'Nov',  total: 134000 },
  { month: 'Dec',  total: 210000 },
  { month: 'Jan',  total: 189000 },
  { month: 'Feb',  total: 245000 },
  { month: 'Mar',  total: 278000 },
  { month: 'Apr',  total: 312000 },
  { month: 'May',  total: 347000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="text-slate-500 mb-0.5">{label}</p>
        <p className="font-semibold text-emerald-600">{formatBDT(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function MonthlyGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#059669" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatBDT(v)}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={85}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#059669"
          strokeWidth={2.5}
          fill="url(#monthlyGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#059669', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}