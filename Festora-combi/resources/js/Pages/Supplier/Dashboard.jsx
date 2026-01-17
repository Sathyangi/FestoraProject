import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

// ProductForm Component
const ProductForm = ({ product = null, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        stock_quantity: product?.stock_quantity || '',
        category: product?.category || '',
        is_available: product?.is_available ?? true,
    });
    const [images, setImages] = useState([]);
    const [removeImages, setRemoveImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Fruits', 'Vegetables', 'Meat', 'Dairy', 'Bakery', 'Grains', 
        'Canned Goods', 'Beverages', 'Snacks', 'Other'
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        
        // Basic validation
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = ['Product name is required'];
        if (!formData.description.trim()) newErrors.description = ['Description is required'];
        if (!formData.price || formData.price <= 0) newErrors.price = ['Valid price is required'];
        if (!formData.stock_quantity || formData.stock_quantity < 0) newErrors.stock_quantity = ['Valid stock quantity is required'];
        if (!formData.category) newErrors.category = ['Category is required'];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSubmit.append(key, formData[key]);
        });
        
        images.forEach(image => {
            formDataToSubmit.append('images[]', image);
        });
        
        if (removeImages.length > 0) {
            removeImages.forEach(imageId => {
                formDataToSubmit.append('remove_images[]', imageId);
            });
        }

        onSubmit(formDataToSubmit, isEditing).catch(error => {
            setErrors(error.response?.data?.errors || { general: ['An error occurred. Please try again.'] });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const toggleRemoveExistingImage = (imageId) => {
        setRemoveImages(prev => 
            prev.includes(imageId) 
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {!isEditing && (
                <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                    <p className="font-semibold">Note:</p>
                    <p>Your product will be submitted for admin approval. You'll be notified once it's reviewed.</p>
                </div>
            )}

            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.general[0]}
                </div>
            )}

            <div className="space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your product"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>}
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (LKR) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                        {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity[0]}</p>}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category[0]}</p>}
                </div>

                {/* Availability */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_available"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
                        Product is available for sale
                    </label>
                </div>

                {/* Existing Images (for editing) */}
                {isEditing && product?.images && product.images.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.images.map((image) => (
                                <div key={image.id} className="relative">
                                    <img
                                        src={`/storage/${image.path}`}
                                        alt="Product"
                                        className={`w-full h-32 object-cover rounded-md ${
                                            removeImages.includes(image.id) ? 'opacity-50' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleRemoveExistingImage(image.id)}
                                        className={`absolute top-2 right-2 p-1 rounded-full ${
                                            removeImages.includes(image.id)
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                        }`}
                                    >
                                        {removeImages.includes(image.id) ? '↩' : '×'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isEditing ? 'Add New Images' : 'Product Images'}
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images[0]}</p>}
                    
                    {/* Preview new images */}
                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Submit for Approval')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Supplier Dashboard Component
export default function SupplierDashboard({ auth, stats, recentNotifications, pendingProductsCount }) {
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleProductSubmit = async (formData, isEditing) => {
        try {
            if (isEditing && editingProduct) {
                // For editing, you need to use the PUT method
                // Inertia supports method spoofing for FormData submissions
                router.post(route('supplier.products.update', editingProduct.id), formData, {
                    _method: 'put',
                    onSuccess: () => {
                         // Show success message and reload stats
                        setShowProductForm(false);
                        setEditingProduct(null);
                        router.reload({ only: ['stats', 'pendingProductsCount'] });
                    },
                     onError: (errors) => {
                        console.error('Update failed:', errors);
                    }
                });
            } else {
                // Create new product request
                router.post(route('supplier.products.store'), formData, {
                    onSuccess: () => {
                         // Show success message and reload stats
                        setShowProductForm(false);
                        router.reload({ only: ['stats', 'pendingProductsCount'] });
                    },
                    onError: (errors) => {
                         console.error('Store failed:', errors);
                    }
                });
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            throw error;
        }
    };

    const handleCancelProductForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const statCards = [
        {
            name: 'Total Products',
            value: stats.total_products,
            icon: '📦',
            color: 'bg-blue-500'
        },
        {
            name: 'Pending Requests',
            value: pendingProductsCount || stats.pending_requests,
            icon: '⏳',
            color: 'bg-yellow-500'
        },
        {
            name: 'Approved Products',
            value: stats.approved_products,
            icon: '✅',
            color: 'bg-green-500'
        },
        {
            name: 'Total Sales',
            value: `LKR ${stats.total_sales.toLocaleString()}`,
            icon: '💰',
            color: 'bg-purple-500'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Supplier Dashboard</h2>}
        >
            <Head title="Supplier Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showProductForm ? (
                        // Show Product Form
                        <ProductForm
                            product={editingProduct}
                            onSubmit={handleProductSubmit}
                            onCancel={handleCancelProductForm}
                            isEditing={!!editingProduct}
                        />
                    ) : (
                        // Show Dashboard
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {statCards.map((stat, index) => (
                                        <div key={index} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
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

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Quick Actions */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Quick Actions
                                            </h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={handleAddProduct}
                                                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center transition-colors"
                                                >
                                                    Add New Product
                                                </button>
                                                <a href={route('supplier.products')} 
                                                    className="block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-center">
                                                    Manage Products
                                                </a>
                                                <a href={route('supplier.product-requests')} 
                                                    className="block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-center">
                                                    View Requests ({pendingProductsCount || stats.pending_requests})
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Notifications */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Recent Notifications
                                                {stats.recent_sales > 0 && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {stats.recent_sales} new
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="space-y-3">
                                                {recentNotifications.length > 0 ? (
                                                    recentNotifications.slice(0, 3).map((notification, index) => (
                                                        <div key={index} className="text-sm">
                                                            <p className="text-gray-900 font-medium">
                                                                {notification.type === 'product_approval' 
                                                                    ? `Product ${notification.data.product_name} ${notification.data.status}`
                                                                    : `Sale: LKR ${notification.amount?.toLocaleString() || '0'}`
                                                                }
                                                            </p>
                                                            <p className="text-gray-500 text-xs">
                                                                {notification.type === 'product_approval' 
                                                                    ? `By Admin`
                                                                    : `Order #${notification.order_payment?.order_id || 'N/A'}`
                                                                }
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No recent notifications</p>
                                                )}
                                                <a href={route('supplier.notifications')} 
                                                    className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                                                    View all notifications →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout Button */}
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
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}