// src/components/charts/DonationTrendChart.tsx
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatBDT } from '@/lib/utils'

function generateLast30Days() {
  const data = []
  const amounts = [
    8500, 12000, 7200, 15000, 9800, 22000, 11000, 6500, 18000, 25000,
    13500, 9000, 31000, 17500, 8200, 14000, 28000, 19500, 11800, 7600,
    23000, 16000, 42000, 12500, 9200, 35000, 21000, 8800, 17000, 29500,
  ]
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    data.push({
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      amount: amounts[29 - i],
    })
  }
  return data
}

const data = generateLast30Days()

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

export default function DonationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tickFormatter={(v) => formatBDT(v)}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#059669"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#059669', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}