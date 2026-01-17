import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProductsIndex({ auth, products, filters }) {
    const [deletingProduct, setDeletingProduct] = useState(null);

    const handleDelete = async (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            try {
                await router.delete(route('supplier.products.destroy', product.id), {
                    preserveState: false,
                    onSuccess: () => {
                        setDeletingProduct(null);
                    }
                });
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const formatPrice = (price) => {
        return `LKR ${parseFloat(price).toLocaleString()}`;
    };

    const getStockStatus = (quantity) => {
        if (quantity > 10) {
            return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
        } else if (quantity > 0) {
            return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
        } else {
            return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Products</h2>}
        >
            <Head title="My Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Product Management</h3>
                                    <p className="text-gray-600">Manage your approved products</p>
                                </div>
                                <Link
                                    href={route('supplier.dashboard')}
                                    className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Add New Product
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters?.search || ''}
                                    onChange={(e) => {
                                        router.get(route('supplier.products'), {
                                            ...filters,
                                            search: e.target.value || undefined
                                        }, { replace: true, preserveState: true });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                
                                <select
                                    value={filters?.category || ''}
                                    onChange={(e) => {
                                        router.get(route('supplier.products'), {
                                            ...filters,
                                            category: e.target.value || undefined
                                        });
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Meat">Meat</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Grains">Grains</option>
                                    <option value="Canned Goods">Canned Goods</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Products Grid */}
                            {products.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.data.map((product) => {
                                            const stockStatus = getStockStatus(product.stock_quantity);
                                            
                                            return (
                                                <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                    {/* Product Image */}
                                                    <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-lg overflow-hidden">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0].thumb || product.images[0].path}
                                                                alt={product.name}
                                                                className="w-full h-48 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-400 text-2xl">📦</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                                                {product.name}
                                                            </h3>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                                                                {stockStatus.text}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                                        
                                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                            {product.description}
                                                        </p>

                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-xl font-bold text-green-600">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                Stock: {product.stock_quantity}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={route('supplier.products.edit', product.id)}
                                                                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm text-center hover:bg-blue-600 transition-colors"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(product)}
                                                                    className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="text-xs text-gray-500 flex justify-between">
                                                                <span>Status: {product.is_active ? 'Active' : 'Inactive'}</span>
                                                                <span>Updated: {new Date(product.updated_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {products.links && (
                                        <div className="mt-8 flex justify-center">
                                            <nav className="flex items-center space-x-2">
                                                {products.links.map((link, index) => (
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
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                                    <p className="text-gray-500 mb-6">
                                        {filters?.search || filters?.category 
                                            ? "No products match your current filters." 
                                            : "You don't have any approved products yet."
                                        }
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        {(filters?.search || filters?.category) && (
                                            <button
                                                onClick={() => router.get(route('supplier.products'))}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                        <Link
                                            href={route('supplier.dashboard')}
                                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            back to dashboard
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}