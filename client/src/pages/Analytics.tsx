import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Analytics Module
 * Comprehensive usage analytics, user behavior, and system insights
 */
export function Analytics() {
  const [dateRange, setDateRange] = useState('7d');

  const dailyUsage = [
    { date: 'Mon', users: 240, sessions: 320, views: 1200 },
    { date: 'Tue', users: 340, sessions: 420, views: 1800 },
    { date: 'Wed', users: 280, sessions: 350, views: 1400 },
    { date: 'Thu', users: 450, sessions: 580, views: 2200 },
    { date: 'Fri', users: 520, sessions: 680, views: 2800 },
    { date: 'Sat', users: 380, sessions: 480, views: 2100 },
    { date: 'Sun', users: 290, sessions: 380, views: 1500 },
  ];

  const deviceMetrics = [
    { name: 'Desktop', value: 6200, percentage: 62 },
    { name: 'Mobile', value: 3100, percentage: 31 },
    { name: 'Tablet', value: 700, percentage: 7 },
  ];

  const pageMetrics = [
    { page: '/dashboard', views: 4500, avgTime: '3m 24s', bounceRate: '12%' },
    { page: '/batteries', views: 3200, avgTime: '2m 18s', bounceRate: '18%' },
    { page: '/systems', views: 2800, avgTime: '1m 45s', bounceRate: '22%' },
    { page: '/reports', views: 1900, avgTime: '4m 12s', bounceRate: '8%' },
    { page: '/admin', views: 850, avgTime: '5m 30s', bounceRate: '3%' },
  ];

  const conversionFunnels = [
    { step: 'Visit', users: 5200, percentage: 100 },
    { step: 'Browse', users: 4680, percentage: 90 },
    { step: 'View Details', users: 3744, percentage: 72 },
    { step: 'Interact', users: 2808, percentage: 54 },
    { step: 'Convert', users: 1560, percentage: 30 },
  ];

  const geographicData = [
    { region: 'North America', users: 2800, growth: '+12%' },
    { region: 'Europe', users: 1900, growth: '+8%' },
    { region: 'Asia Pacific', users: 1600, growth: '+15%' },
    { region: 'South America', users: 520, growth: '+5%' },
    { region: 'Africa', users: 380, growth: '+18%' },
  ];

  const COLORS = ['#00EAD3', '#06B6D4', '#0EA5E9', '#3B82F6', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Comprehensive usage insights and system performance data</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2">
          {['1d', '7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                dateRange === range
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range === '1d' ? 'Today' : range === '1y' ? 'Year' : range.toUpperCase()}
            </button>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">24.8K</div>
                  <p className="text-xs text-green-400 mt-2">↑ 12% from last period</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">18.2K</div>
                  <p className="text-xs text-green-400 mt-2">↑ 8% from last period</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">3m 42s</div>
                  <p className="text-xs text-green-400 mt-2">↑ 5% from last period</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">14.2%</div>
                  <p className="text-xs text-green-400 mt-2">↓ 2.1% from last period</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Usage Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Active Users</CardTitle>
                <CardDescription className="text-gray-400">User engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyUsage}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00EAD3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00EAD3" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#00EAD3" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Session Types Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Session Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sessions" stroke="#06B6D4" strokeWidth={2} />
                    <Line type="monotone" dataKey="views" stroke="#0EA5E9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Pages</CardTitle>
                <CardDescription className="text-gray-400">Most viewed pages and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageMetrics.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{page.page}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {page.views.toLocaleString()} views • Bounce: {page.bounceRate}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyan-400">{page.avgTime}</div>
                        <p className="text-xs text-gray-400">avg time</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funnel Tab */}
          <TabsContent value="funnel" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {conversionFunnels.map((level, idx) => {
                  const width = (level.percentage / 100) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold text-white">{level.step}</h4>
                        <span className="text-sm text-gray-400">{level.users.toLocaleString()} users</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full flex items-center justify-end pr-3 transition"
                          style={{ width: `${width}%` }}
                        >
                          <span className="text-sm font-semibold text-gray-900">{level.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {geographicData.map((region, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{region.region}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-cyan-400">{region.users.toLocaleString()}</div>
                          <p className="text-xs text-gray-400">users</p>
                        </div>
                        <Badge className="bg-green-600">{region.growth}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Device Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col lg:flex-row gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceMetrics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-col justify-center gap-4">
                  {deviceMetrics.map((device, idx) => (
                    <div key={idx} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <h3 className="font-semibold text-white">{device.name}</h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <div className="text-2xl font-bold text-cyan-400">{device.percentage}%</div>
                        <p className="text-sm text-gray-400">{device.value.toLocaleString()} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Analytics;
