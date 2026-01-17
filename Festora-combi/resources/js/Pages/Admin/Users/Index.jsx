import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UserManagement({ auth, users, filters }) {
    const handleUserStatusUpdate = (userId, status) => {
        router.patch(route('admin.users.status', userId), {
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'inactive': return 'text-red-600 bg-red-100';
            case 'suspended': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <Link 
                        href={route('admin.dashboard')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Dashboard
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">User Management</h2>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Simple Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-2xl font-bold text-blue-600">{users.total}</div>
                            <div className="text-sm text-gray-600">Total Users</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-2xl font-bold text-green-600">
                                {users.data.filter(u => u.status === 'active').length}
                            </div>
                            <div className="text-sm text-gray-600">Active Users</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-2xl font-bold text-orange-600">
                                {users.data.filter(u => u.user_type === 'supplier').length}
                            </div>
                            <div className="text-sm text-gray-600">Suppliers</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-2xl font-bold text-purple-600">
                                {users.data.filter(u => u.user_type === 'organization').length}
                            </div>
                            <div className="text-sm text-gray-600">Organizations</div>
                        </div>
                    </div>

                    {/* Simple Filters */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onChange={(e) => router.get(route('admin.users'), { ...filters, user_type: e.target.value })}
                                value={filters.user_type || ''}
                            >
                                <option value="">All User Types</option>
                                <option value="customer">Customers</option>
                                <option value="supplier">Suppliers</option>
                                <option value="organization">Organizations</option>
                            </select>
                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onChange={(e) => router.get(route('admin.users'), { ...filters, status: e.target.value })}
                                value={filters.status || ''}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filters.search || ''}
                                onChange={(e) => router.get(route('admin.users'), { ...filters, search: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                                                {user.user_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)} capitalize`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <select
                                                value={user.status}
                                                onChange={(e) => handleUserStatusUpdate(user.id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Pagination */}
                        <div className="px-6 py-3 bg-gray-50 border-t">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Showing {users.from} to {users.to} of {users.total} users
                                </div>
                                <div className="flex space-x-2">
                                    {users.prev_page_url && (
                                        <Link href={users.prev_page_url} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">
                                            Previous
                                        </Link>
                                    )}
                                    {users.next_page_url && (
                                        <Link href={users.next_page_url} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">
                                            Next
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}