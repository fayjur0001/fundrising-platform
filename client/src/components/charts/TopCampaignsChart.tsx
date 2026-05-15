// src/components/charts/TopCampaignsChart.tsx
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatBDT } from '@/lib/utils'

const data = [
  { name: 'Flood Relief Fund 2024',        raised: 485000 },
  { name: 'School for Rural Children',     raised: 372000 },
  { name: 'Clean Water Bangladesh',        raised: 298000 },
  { name: 'Medical Aid for Sylhet',        raised: 215000 },
  { name: 'Tree Plantation Drive',         raised: 143000 },
]

function truncate(str: string, max = 20) {
  return str.length > max ? str.slice(0, max) + '…' : str
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="text-slate-600 mb-0.5 max-w-[160px] leading-snug">{payload[0].payload.name}</p>
        <p className="font-semibold text-emerald-600">{formatBDT(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function TopCampaignsChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => formatBDT(v)}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickFormatter={(v) => truncate(v)}
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          width={130}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4' }} />
        <Bar dataKey="raised" fill="#059669" radius={[0, 4, 4, 0]} barSize={22}>
          {data.map((_, i) => (
            <Cell key={i} fill="#059669" fillOpacity={1 - i * 0.12} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}