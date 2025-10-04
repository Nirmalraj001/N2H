import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { ordersAPI, productsAPI, usersAPI } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const [orders, products, users] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        usersAPI.getAll(),
      ]);

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
        totalProducts: products.length,
        totalUsers: users.length,
      });
    };
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="w-5 h-5 mb-2 text-blue-600" />
              <p className="font-medium">Manage Products</p>
              <p className="text-sm text-gray-600">Add, edit, or remove products</p>
            </Link>
            <Link
              to="/admin/orders"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mb-2 text-blue-600" />
              <p className="font-medium">Manage Orders</p>
              <p className="text-sm text-gray-600">View and update order status</p>
            </Link>
            <Link
              to="/admin/users"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-5 h-5 mb-2 text-blue-600" />
              <p className="font-medium">Manage Users</p>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};
