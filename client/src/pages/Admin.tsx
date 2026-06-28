import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Admin Dashboard
 * System management, monitoring, and feature control
 */
export function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for system metrics
  const systemMetrics = [
    { hour: '00:00', requests: 240, errors: 12, uptime: 99.9 },
    { hour: '04:00', requests: 380, errors: 18, uptime: 99.8 },
    { hour: '08:00', requests: 520, errors: 8, uptime: 99.95 },
    { hour: '12:00', requests: 680, errors: 15, uptime: 99.9 },
    { hour: '16:00', requests: 750, errors: 22, uptime: 99.85 },
    { hour: '20:00', requests: 890, errors: 10, uptime: 99.92 },
  ];

  const featureFlags = [
    { name: 'admin_dashboard', enabled: true, rollout: 100 },
    { name: 'analytics_module', enabled: true, rollout: 80 },
    { name: 'dark_mode', enabled: true, rollout: 100 },
    { name: 'export_reports', enabled: true, rollout: 100 },
    { name: 'advanced_charts', enabled: false, rollout: 0 },
    { name: 'api_v2', enabled: false, rollout: 0 },
    { name: 'ai_recommendations', enabled: false, rollout: 0 },
  ];

  const systemHealth = [
    { metric: 'API Uptime', value: '99.92%', status: 'healthy' },
    { metric: 'Database Health', value: 'Healthy', status: 'healthy' },
    { metric: 'Cache Hit Rate', value: '94.3%', status: 'healthy' },
    { metric: 'Error Rate', value: '0.08%', status: 'healthy' },
    { metric: 'Response Time', value: '145ms', status: 'healthy' },
    { metric: 'Memory Usage', value: '62%', status: 'warning' },
  ];

  const recentUsers = [
    { id: 'user1', email: 'alice@example.com', role: 'admin', lastSeen: '5 min ago', status: 'online' },
    { id: 'user2', email: 'bob@example.com', role: 'user', lastSeen: '2 hours ago', status: 'offline' },
    { id: 'user3', email: 'charlie@example.com', role: 'user', lastSeen: '1 day ago', status: 'offline' },
    { id: 'user4', email: 'diana@example.com', role: 'user', lastSeen: '10 min ago', status: 'online' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">System monitoring, management, and configuration</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemHealth.map((item, idx) => (
                <Card key={idx} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {item.metric}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-white">{item.value}</div>
                      <Badge className={item.status === 'healthy' ? 'bg-green-600' : 'bg-yellow-600'}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Metrics Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Metrics (24h)</CardTitle>
                <CardDescription className="text-gray-400">
                  Requests, errors, and uptime trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#00EAD3" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Requests Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Request Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={systemMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="requests" fill="#00EAD3" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Feature Flags</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage feature availability and rollout percentages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{flag.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Rollout: {flag.rollout}%
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={flag.enabled ? 'bg-green-600' : 'bg-gray-600'}>
                          {flag.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add New Feature</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Feature name" 
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    placeholder="Rollout %"
                    className="w-full"
                  />
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    Create Feature Flag
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Active Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Recently active users and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{user.email}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {user.role} • Last seen {user.lastSeen}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={user.status === 'online' ? 'bg-green-600' : 'bg-gray-600'}>
                          {user.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Rate Limit
                  </label>
                  <input 
                    type="number" 
                    defaultValue={100}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">requests per 15 minutes</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Log Level
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                    <option>info</option>
                    <option>debug</option>
                    <option>warn</option>
                    <option>error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max File Upload Size (MB)
                  </label>
                  <input 
                    type="number" 
                    defaultValue={50}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Save Settings
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  🔄 Clear Cache
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  📊 Run Diagnostics
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  💾 Backup Database
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;
