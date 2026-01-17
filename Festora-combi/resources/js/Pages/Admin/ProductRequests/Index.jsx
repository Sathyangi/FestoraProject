import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProductRequestsIndex({ auth, requests, filters }) {
    const [reviewingRequest, setReviewingRequest] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        status: '',
        admin_notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await router.patch(route('admin.product-requests.review', reviewingRequest.id), reviewForm, {
                preserveState: false,
                onSuccess: () => {
                    setReviewingRequest(null);
                    setReviewForm({ status: '', admin_notes: '' });
                }
            });
        } catch (error) {
            console.error('Error reviewing product request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openReviewModal = (request, status) => {
        setReviewingRequest(request);
        setReviewForm({ status, admin_notes: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatPrice = (price) => {
        return `LKR ${parseFloat(price).toLocaleString()}`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Requests</h2>}
        >
            <Head title="Product Requests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="mb-6">
                                <div className="flex gap-4">
                                    <select
                                        value={filters?.status || ''}
                                        onChange={(e) => {
                                            router.get(route('admin.product-requests'), {
                                                ...filters,
                                                status: e.target.value || undefined
                                            });
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Search products or suppliers..."
                                        value={filters?.search || ''}
                                        onChange={(e) => {
                                            router.get(route('admin.product-requests'), {
                                                ...filters,
                                                search: e.target.value || undefined
                                            }, { replace: true, preserveState: true });
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Requests Grid */}
                            <div className="grid gap-6">
                                {requests.data.length > 0 ? (
                                    requests.data.map((request) => (
                                        <div key={request.id} className="bg-gray-50 rounded-lg p-6 border">
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
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                                                            <span className="text-gray-400">No Image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                {request.name}
                                                            </h3>
                                                            <p className="text-gray-600 mb-1">
                                                                Supplier: {request.supplier?.name}
                                                            </p>
                                                            <p className="text-gray-600 mb-1">
                                                                Category: {request.category}
                                                            </p>
                                                            <p className="text-gray-600">
                                                                Submitted: {new Date(request.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <span className="font-medium text-gray-700">Price:</span>
                                                            <p className="text-lg font-semibold text-green-600">
                                                                {formatPrice(request.price)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Stock:</span>
                                                            <p className="text-lg font-semibold">
                                                                {request.stock_quantity} units
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Available:</span>
                                                            <p className="text-lg font-semibold">
                                                                {request.is_available ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <span className="font-medium text-gray-700">Description:</span>
                                                        <p className="text-gray-600 mt-1 line-clamp-3">
                                                            {request.description}
                                                        </p>
                                                    </div>

                                                    {request.admin_notes && (
                                                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                                            <span className="font-medium text-yellow-800">Admin Notes:</span>
                                                            <p className="text-yellow-700 mt-1">{request.admin_notes}</p>
                                                        </div>
                                                    )}

                                                    {request.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openReviewModal(request, 'approved')}
                                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => openReviewModal(request, 'rejected')}
                                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}

                                                    {request.status !== 'pending' && (
                                                        <div className="text-sm text-gray-500">
                                                            Reviewed by {request.reviewer?.name} on{' '}
                                                            {request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Product Requests</h3>
                                        <p className="text-gray-500">No product requests found matching your criteria.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {requests.links && (
                                <div className="mt-6 flex justify-center">
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
                                                className={`px-3 py-2 text-sm rounded ${
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

            {/* Review Modal */}
            {reviewingRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {reviewForm.status === 'approved' ? 'Approve' : 'Reject'} Product Request
                        </h3>
                        
                        <div className="mb-4">
                            <p className="text-gray-600">Product: <strong>{reviewingRequest.name}</strong></p>
                            <p className="text-gray-600">Supplier: <strong>{reviewingRequest.supplier?.name}</strong></p>
                        </div>

                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Notes {reviewForm.status === 'rejected' ? '(Required for rejection)' : '(Optional)'}
                                </label>
                                <textarea
                                    value={reviewForm.admin_notes}
                                    onChange={(e) => setReviewForm({...reviewForm, admin_notes: e.target.value})}
                                    rows={4}
                                    required={reviewForm.status === 'rejected'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={
                                        reviewForm.status === 'approved' 
                                            ? "Optional feedback for the supplier..." 
                                            : "Please provide a reason for rejection..."
                                    }
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setReviewingRequest(null)}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 text-white rounded disabled:opacity-50 ${
                                        reviewForm.status === 'approved'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                >
                                    {isSubmitting ? 'Processing...' : 
                                        (reviewForm.status === 'approved' ? 'Approve & Create Product' : 'Reject Request')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}