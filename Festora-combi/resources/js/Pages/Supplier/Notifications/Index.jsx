import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NotificationsIndex({ auth, notifications }) {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'product_request_reviewed':
                return '📋';
            case 'product_created':
                return '✅';
            case 'product_approved':
                return '🎉';
            case 'product_rejected':
                return '❌';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'product_approved':
            case 'product_created':
                return 'border-l-green-400 bg-green-50';
            case 'product_rejected':
                return 'border-l-red-400 bg-red-50';
            case 'product_request_reviewed':
                return 'border-l-blue-400 bg-blue-50';
            default:
                return 'border-l-gray-400 bg-gray-50';
        }
    };

    const formatRelativeTime = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} days ago`;
        
        return notificationDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getActionButton = (notification) => {
        const data = notification.data || {};
        
        switch (notification.type) {
            case 'product_created':
                return (
                    <Link
                        href={route('supplier.products')}
                        className="mt-3 inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                        View Product
                    </Link>
                );
            case 'product_rejected':
                return (
                    <Link
                        href={route('supplier.dashboard')}
                        className="mt-3 inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                        Submit New Product
                    </Link>
                );
            case 'product_request_reviewed':
                if (data.status === 'approved') {
                    return (
                        <Link
                            href={route('supplier.products')}
                            className="mt-3 inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                            View Products
                        </Link>
                    );
                } else {
                    return (
                        <Link
                            href={route('supplier.product-requests')}
                            className="mt-3 inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                            View Requests
                        </Link>
                    );
                }
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Notifications</h2>}
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Your Notifications</h3>
                                    <p className="text-gray-600">Stay updated on your product submissions and sales</p>
                                </div>
                                <Link
                                    href={route('supplier.dashboard')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>

                            {/* Notifications List */}
                            {notifications.data && notifications.data.length > 0 ? (
                                <div className="space-y-4">
                                    {notifications.data.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border-l-4 p-4 rounded-r-lg ${getNotificationColor(notification.type)} ${
                                                !notification.is_read ? 'ring-2 ring-blue-200' : ''
                                            }`}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 text-2xl mr-3">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-lg font-medium text-gray-900 mb-1">
                                                            {notification.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                                {formatRelativeTime(notification.created_at)}
                                                            </span>
                                                            {!notification.is_read && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-gray-700 mb-2">
                                                        {notification.message}
                                                    </p>

                                                    {/* Additional Details */}
                                                    {notification.data && (
                                                        <div className="text-sm text-gray-600">
                                                            {notification.data.product_name && (
                                                                <p className="mb-1">
                                                                    <span className="font-medium">Product:</span> {notification.data.product_name}
                                                                </p>
                                                            )}
                                                            
                                                            {notification.data.admin_notes && (
                                                                <div className="mt-2 p-2 bg-white border rounded">
                                                                    <p className="font-medium text-gray-800 mb-1">Admin Notes:</p>
                                                                    <p className="text-gray-700 text-sm">
                                                                        {notification.data.admin_notes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Action Button */}
                                                    {getActionButton(notification)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 text-6xl mb-4">🔔</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
                                    <p className="text-gray-500 mb-6">
                                        You'll see notifications here when there are updates about your products.
                                    </p>
                                    <Link
                                        href={route('supplier.dashboard')}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            )}

                            {/* Pagination */}
                            {notifications.links && notifications.data.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {notifications.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url);
                                                    }
                                                }}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm rounded transition-colors ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}