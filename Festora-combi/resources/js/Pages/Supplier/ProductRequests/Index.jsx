import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProductRequestsIndex({ auth, requests, filters }) {
    const productRequests = requests?.data || [];
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'approved': return '✅';
            case 'rejected': return '❌';
            default: return '📋';
        }
    };

    const formatPrice = (price) => {
        return `LKR ${parseFloat(price).toLocaleString()}`;
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending': 
                return 'Your product request is being reviewed by our admin team. You will be notified once it has been processed.';
            case 'approved': 
                return 'Congratulations! Your product has been approved and is now available for customers to purchase.';
            case 'rejected': 
                return 'Your product request has been rejected. Please review the admin notes and consider resubmitting with improvements.';
            default: 
                return '';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Product Requests</h2>}
        >
            <Head title="Product Requests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Product Request History</h3>
                                    <p className="text-gray-600">Track the status of your product submissions</p>
                                </div>
                                <Link
                                    href={route('supplier.dashboard')}
                                    className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Submit New Product
                                </Link>
                            </div>

                            {/* Status Filter */}
                            <div className="mb-6">
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => router.get(route('supplier.product-requests'), { status: undefined })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            !filters?.status 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        All ({requests.total})
                                    </button>
                                    <button
                                        onClick={() => router.get(route('supplier.product-requests'), { status: 'pending' })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            filters?.status === 'pending' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => router.get(route('supplier.product-requests'), { status: 'approved' })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            filters?.status === 'approved' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Approved
                                    </button>
                                    <button
                                        onClick={() => router.get(route('supplier.product-requests'), { status: 'rejected' })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            filters?.status === 'rejected' 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Rejected
                                    </button>
                                </div>
                            </div>

                            {/* Requests List */}
                            <div className="space-y-6">
                                {requests.data.length > 0 ? (
                                    requests.data.map((request) => (
                                        <div key={request.id} className="bg-gray-50 rounded-lg border p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Images */}
                                                <div className="flex-shrink-0">
                                                    {request.images && request.images.length > 0 ? (
                                                        <div className="grid grid-cols-2 gap-2 w-48">
                                                            {request.images.slice(0, 4).map((image, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={image.thumb || image.path}
                                                                    alt={`Product ${index + 1}`}
                                                                    className="w-20 h-20 object-cover rounded"
                                                                />
                                                            ))}
                                                            {request.images.length > 4 && (
                                                                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        +{request.images.length - 4}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                                                            <span className="text-gray-400 text-sm">No Image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow">
                                                    {/* Header */}
                                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                                                        <div className="flex-grow">
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                {getStatusIcon(request.status)} {request.name}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                                                <span>Category: {request.category}</span>
                                                                <span>Price: {formatPrice(request.price)}</span>
                                                                <span>Stock: {request.stock_quantity} units</span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                Submitted: {new Date(request.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 sm:mt-0">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Status Message */}
                                                    <div className={`p-3 rounded-md mb-4 border-l-4 ${
                                                        request.status === 'pending' ? 'bg-yellow-50 border-yellow-400' :
                                                        request.status === 'approved' ? 'bg-green-50 border-green-400' :
                                                        'bg-red-50 border-red-400'
                                                    }`}>
                                                        <p className="text-sm font-medium text-gray-800 mb-1">
                                                            {request.status === 'pending' && 'Under Review'}
                                                            {request.status === 'approved' && 'Approved & Live'}
                                                            {request.status === 'rejected' && 'Request Rejected'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {getStatusMessage(request.status)}
                                                        </p>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="mb-4">
                                                        <span className="font-medium text-gray-700 text-sm">Description:</span>
                                                        <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                                                            {request.description}
                                                        </p>
                                                    </div>

                                                    {/* Admin Notes */}
                                                    {request.admin_notes && (
                                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                                            <span className="font-medium text-blue-800 text-sm">Admin Feedback:</span>
                                                            <p className="text-blue-700 mt-1 text-sm">{request.admin_notes}</p>
                                                            {request.reviewed_at && (
                                                                <p className="text-xs text-blue-600 mt-2">
                                                                    Reviewed: {new Date(request.reviewed_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex gap-2 mt-4">
                                                        {request.status === 'approved' && (
                                                            <Link
                                                                href={route('supplier.products')}
                                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                                            >
                                                                View in Products
                                                            </Link>
                                                        )}
                                                        {request.status === 'rejected' && (
                                                            <Link
                                                                href={route('supplier.dashboard')}
                                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                            >
                                                                Submit Revised Version
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Product Requests</h3>
                                        <p className="text-gray-500 mb-6">You haven't submitted any product requests yet.</p>
                                        <Link
                                            href={route('supplier.dashboard')}
                                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Submit Your First Product
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {requests.links && requests.data.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {requests.links.map((link, index) => (
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