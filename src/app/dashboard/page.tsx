'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-2">Total Students</div>
            <div className="text-3xl font-bold text-indigo-600">
              {analytics?.overview?.totalStudents || 0}
            </div>
            <div className="text-sm text-green-600 mt-2">
              {analytics?.overview?.activeStudents || 0} active
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-2">Total Courses</div>
            <div className="text-3xl font-bold text-indigo-600">
              {analytics?.overview?.totalCourses || 0}
            </div>
            <div className="text-sm text-green-600 mt-2">Published</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-2">Total Enrollments</div>
            <div className="text-3xl font-bold text-indigo-600">
              {analytics?.overview?.totalEnrollments || 0}
            </div>
            <div className="text-sm text-green-600 mt-2">
              {analytics?.overview?.completedCourses || 0} completed
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-2">Total Donations</div>
            <div className="text-3xl font-bold text-indigo-600">
              ${analytics?.overview?.totalDonations?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-green-600 mt-2">USD</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Students by Type</h2>
            {analytics?.studentsByType && (
              <div className="space-y-3">
                {analytics.studentsByType.map((item: any) => (
                  <div key={item.studentType} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.studentType}</span>
                    <span className="font-semibold">{item._count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics?.recentActivities?.slice(0, 10).map((activity: any) => (
                <div key={activity.id} className="text-sm">
                  <div className="font-medium">{activity.user.name}</div>
                  <div className="text-gray-500">{activity.action}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Enrollment Trends (Last 6 Months)</h2>
          {analytics?.enrollmentsByMonth && analytics.enrollmentsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.enrollmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-500 text-center py-8">No enrollment data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
