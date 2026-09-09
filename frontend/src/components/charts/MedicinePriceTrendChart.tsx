import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ConsumerMedicine } from '../../types';

interface MedicinePriceTrendChartProps {
  medicine: ConsumerMedicine;
}

interface PricePoint {
  date: string;
  dayLabel: string;
  floorPrice: number;
  averageMarketPrice: number;
  innovatorPrice: number;
}

export const MedicinePriceTrendChart: React.FC<MedicinePriceTrendChartProps> = ({ medicine }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [showAverageLine, setShowAverageLine] = useState(true);

  // Generate a realistic 30-day price trend leading up to today's genericFloorPrice
  const priceHistory = useMemo(() => {
    const points: PricePoint[] = [];
    const baseFloor = medicine.genericFloorPrice;
    const baseInnovator = medicine.innovatorPrice;
    
    // Seed variance based on medicine ID for deterministic, realistic trajectories
    const seedOffset = medicine.id.charCodeAt(medicine.id.length - 1) % 5;
    const startFloor = +(baseFloor * (1.12 + seedOffset * 0.02)).toFixed(2);
    
    const today = new Date('2026-09-07T00:00:00Z');

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      
      // Gradually trend down towards the current generic floor with realistic daily market fluctuations
      const progress = (29 - i) / 29; // 0 to 1
      const trendValue = startFloor - (startFloor - baseFloor) * Math.pow(progress, 0.8);
      
      // Small daily oscillation (+- 1.5%) except on the final day which must match baseFloor exactly
      const noise = i === 0 ? 0 : (Math.sin(i * 1.7 + seedOffset) * 0.15);
      const floorPrice = +(Math.max(baseFloor * 0.95, trendValue + noise)).toFixed(2);
      const averageMarketPrice = +(floorPrice * 1.08 + (Math.cos(i) * 0.1)).toFixed(2);

      points.push({
        date: dateStr,
        dayLabel: i === 0 ? 'Today' : `${i}d ago`,
        floorPrice: i === 0 ? baseFloor : floorPrice,
        averageMarketPrice: i === 0 ? +(baseFloor * 1.08).toFixed(2) : averageMarketPrice,
        innovatorPrice: baseInnovator,
      });
    }

    return points;
  }, [medicine]);

  // Filter based on selected time range
  const displayedData = useMemo(() => {
    if (timeRange === '7d') return priceHistory.slice(23);
    if (timeRange === '14d') return priceHistory.slice(16);
    return priceHistory;
  }, [priceHistory, timeRange]);

  const prices = displayedData.map((d) => d.floorPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const firstPrice = displayedData[0]?.floorPrice || medicine.genericFloorPrice;
  const currentPrice = displayedData[displayedData.length - 1]?.floorPrice || medicine.genericFloorPrice;
  const priceChange = +(currentPrice - firstPrice).toFixed(2);
  const percentChange = +(((currentPrice - firstPrice) / firstPrice) * 100).toFixed(1);
  const avgFloor = +(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Chart Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg">show_chart</span>
            <h4 className="text-xs font-black text-slate-900">Generic Wholesale Floor Price Trend</h4>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Live GxP Micro-Hubs
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Daily minimum generic floor across 482 licensed partner micro-hubs
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['7d', '14d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                timeRange === range
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Callouts */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {timeRange.toUpperCase()} Price Trend
          </span>
          <div className="flex items-center gap-1">
            <span
              className={`font-black text-sm flex items-center ${
                priceChange <= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {priceChange <= 0 ? 'trending_down' : 'trending_up'}
              </span>
              <span>
                {priceChange <= 0 ? '' : '+'}
                {percentChange}%
              </span>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {priceChange <= 0 ? `-$${Math.abs(priceChange).toFixed(2)} drop` : `+$${priceChange.toFixed(2)} rise`}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {timeRange.toUpperCase()} Low Floor
          </span>
          <div className="font-mono font-black text-sm text-emerald-800">
            ${minPrice.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            High: ${maxPrice.toFixed(2)}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Average Floor
          </span>
          <div className="font-mono font-black text-sm text-slate-800">
            ${avgFloor.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            vs ${medicine.innovatorPrice.toFixed(2)} brand
          </span>
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div className="w-full h-52 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={displayedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorFloorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[Math.floor(minPrice * 0.9), Math.ceil(maxPrice * 1.1)]}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PricePoint;
                  const currentFloor = data.floorPrice;
                  const innovator = data.innovatorPrice;
                  const savings = innovator - currentFloor;
                  const savingsPct = Math.round((savings / innovator) * 100);

                  return (
                    <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-700 text-xs space-y-1">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between gap-4">
                        <span>{data.date}</span>
                        <span className="text-emerald-400 font-mono text-[11px]">{data.dayLabel}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4 text-emerald-400 font-bold">
                        <span>Generic Floor:</span>
                        <span className="font-mono text-sm">${currentFloor.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4 text-slate-400 text-[11px]">
                        <span>Market Avg:</span>
                        <span className="font-mono">${data.averageMarketPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4 text-slate-400 text-[11px]">
                        <span>Innovator Brand:</span>
                        <span className="font-mono line-through">${innovator.toFixed(2)}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-300 font-bold flex justify-between">
                        <span>Arbitrage Savings:</span>
                        <span>Save ${savings.toFixed(2)} ({savingsPct}%)</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {showAverageLine && (
              <ReferenceLine
                y={avgFloor}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{
                  value: `Avg: $${avgFloor.toFixed(2)}`,
                  fill: '#64748b',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="floorPrice"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorFloorPrice)"
              activeDot={{ r: 5, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer / Insights */}
      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span className="font-medium text-slate-700">Generic Floor</span>
          </span>
          <button
            onClick={() => setShowAverageLine(!showAverageLine)}
            className={`flex items-center gap-1 hover:text-slate-800 cursor-pointer ${
              showAverageLine ? 'text-slate-700 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-slate-500 inline-block"></span>
            <span>{showAverageLine ? 'Avg Line On' : 'Avg Line Off'}</span>
          </button>
        </div>

        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">trending_down</span>
          <span>Wholesale floor is at its lowest level in 30 days</span>
        </span>
      </div>
    </div>
  );
};
