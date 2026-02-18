import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface AnalyticsData {
    slug: string;
    totalClicks: number;
    byDevice: { name: string; value: number }[];
    byBrowser: { name: string; value: number }[];
    byOs: { name: string; value: number }[];
}

interface AnalyticsDashboardProps {
    data: AnalyticsData;
}



export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    if (!data) return null;

    return (
        <div className="w-full mt-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-black">
                    Analytics <span className="text-gray-400 font-normal">/ {data.slug}</span>
                </h2>
               
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Total Clicks</p>
                    <p className="text-4xl font-bold text-black">{data.totalClicks}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Unique Devices</p>
                    <p className="text-4xl font-bold text-black">{data.byDevice.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Top Browser</p>
                    <p className="text-2xl font-bold text-black truncate">{data.byBrowser[0]?.name || "N/A"}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Device Breakdown (Bar Chart) */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold mb-6 text-gray-800 uppercase tracking-wide">Devices</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byDevice}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="value" fill="#18181b" radius={[4, 4, 4, 4]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* OS Breakdown (Pie Chart) */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold mb-6 text-gray-800 uppercase tracking-wide">Operating Systems</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.byOs}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.byOs.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? "#18181b" : "#e4e4e7"} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Browser Breakdown (Bar Chart - Horizontal) */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 md:col-span-2">
                    <h3 className="text-sm font-bold mb-6 text-gray-800 uppercase tracking-wide">Browsers</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.byBrowser} layout="vertical">
                                <XAxis type="number" allowDecimals={false} hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                                <Bar dataKey="value" fill="#52525b" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f4f4f5', radius: 4 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
