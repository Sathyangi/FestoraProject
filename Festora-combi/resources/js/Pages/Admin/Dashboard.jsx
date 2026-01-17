import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminDashboard({ auth, stats }) {
    const [isLoading, setIsLoading] = useState(!stats);
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    useEffect(() => {
        if (stats) {
            setIsLoading(false);
        }
    }, [stats]);

    // Format currency function with proper null handling
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return 'LKR 0';
        return `LKR ${value.toLocaleString()}`;
    };

    // Format number function with proper null handling
    const formatNumber = (value) => {
        if (value === null || value === undefined) return '0';
        return value.toLocaleString();
    };

    const statCards = [
        {
            name: 'Total Users',
            value: isLoading ? 'Loading...' : formatNumber(stats?.total_users),
            icon: '👥',
            color: 'bg-blue-500'
        },
        {
            name: 'Total Suppliers',
            value: isLoading ? 'Loading...' : formatNumber(stats?.total_suppliers),
            icon: '🏪',
            color: 'bg-yellow-500'
        },
        {
            name: 'Total Organizations',
            value: isLoading ? 'Loading...' : formatNumber(stats?.total_organizations),
            icon: '🏛️',
            color: 'bg-purple-500'
        },
        {
            name: 'Total Products',
            value: isLoading ? 'Loading...' : formatNumber(stats?.total_products),
            icon: '📦',
            color: 'bg-orange-500'
        },
        {
            name: 'Total Donations',
            value: isLoading ? 'Loading...' : formatNumber(stats?.total_donations),
            icon: '💝',
            color: 'bg-pink-500'
        },
        {
            name: 'Total Donation Amount',
            value: isLoading ? 'Loading...' : formatCurrency(stats?.total_donation_amount),
            icon: '💰',
            color: 'bg-emerald-500'
        },
        {
            name: 'Total Revenue',
            value: isLoading ? 'Loading...' : formatCurrency(stats?.total_revenue),
            icon: '🏦',
            color: 'bg-green-500'
        }
    ];

    if (isLoading) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
            >
                <Head title="Admin Dashboard" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 text-center">
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    <span className="ml-3 text-lg">Loading dashboard data...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {statCards.map((stat, index) => (
                                    <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center text-white text-lg`}>
                                                        {stat.icon}
                                                    </div>
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                                            {stat.name}
                                                        </dt>
                                                        <dd className="text-lg font-medium text-gray-900">
                                                            {stat.value}
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Quick Actions
                                        </h3>
                                        <div className="space-y-3">
                                            <Link href={route('admin.users')} 
                                               className="block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center">
                                                Manage Users
                                            </Link>
                                            <Link href={route('admin.product-requests')} 
                                               className="block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-center">
                                                Review Product Requests
                                            </Link>
                                            <Link href={route('admin.donation-requests')} 
                                               className="block px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-center">
                                                Review Donation Requests
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            System Status
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">System Status</span>
                                                <span className="text-sm text-green-600 font-medium">Active</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Monthly Orders</span>
                                                <span className="text-sm text-gray-900 font-medium">
                                                    {stats?.monthly_orders ? formatNumber(stats.monthly_orders) : '0'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Database</span>
                                                <span className="text-sm text-green-600 font-medium">Connected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}