// src/components/admin/DonutChart.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Donut chart for traffic/sales breakdown shown on the Dashboard.
// Uses Recharts PieChart with inner radius creating the donut shape.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-lg px-3 py-1.5">
      <p className="text-xs font-medium text-gray-700">
        {payload[0].name}: <span className="text-[#AE3E27]">{payload[0].value}%</span>
      </p>
    </div>
  );
}

export default function DonutChart({ data = [] }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Chart */}
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            dataKey="value"
            paddingAngle={3}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 w-full px-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
