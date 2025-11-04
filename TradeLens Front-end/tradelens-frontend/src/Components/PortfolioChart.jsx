import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PortfolioChart({ holdings }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={holdings}
            dataKey="quantity"
            nameKey="symbol"
            outerRadius={100}
            label
          >
            {holdings.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
