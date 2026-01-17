import Layout from '../Layouts/Layouts';
import Footer from '../Components/Footer';
import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import heroImage from '../../assets/hero.jpg'; // Adjust path as needed

function Products({ products = [], categories = [], filters = {}, totalProducts = 0, auth = {} }) {
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState(filters.availability || 'All');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [modalProduct, setModalProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  // Safe access to product properties with fallbacks
  const safeProducts = Array.isArray(products) ? products.map(product => ({
    id: product?.id || 'unknown',
    name: product?.name || 'Unnamed Product',
    category: product?.category || 'Uncategorized',
    price: product?.price || 0,
    stock_quantity: product?.stock_quantity || 0,
    description: product?.description || '',
    image_url: product?.image_url || null,
    created_at: product?.created_at || null,
    updated_at: product?.updated_at || null
  })) : [];

  const safeCategories = Array.isArray(categories) ? categories : [];

  // Update filters when they change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    if (selectedAvailability !== 'All') {
      params.set('availability', selectedAvailability);
    }
    if (searchTerm && searchTerm.trim()) {
      params.set('search', searchTerm);
    }

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    router.get(url, {}, {
      preserveState: true,
      replace: true,
      only: ['products', 'filters'],
    });
  }, [selectedCategory, selectedAvailability, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(isNaN(numPrice) ? 0 : numPrice);
  };

  const getAvailabilityBadge = (product) => {
    const stock = parseInt(product.stock_quantity) || 0;
    if (stock > 10) {
      return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">In Stock</span>;
    } else if (stock > 0) {
      return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Low Stock</span>;
    } else {
      return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Out of Stock</span>;
    }
  };

  // Cart functions
  const addToCart = (product) => {
    console.log('Adding to cart:', product); // Debug log
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        const updatedCart = prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) }
            : item
        );
        console.log('Updated cart:', updatedCart); // Debug log
        return updatedCart;
      }
      const newCart = [...prevCart, { ...product, quantity: 1 }];
      console.log('New cart:', newCart); // Debug log
      return newCart;
    });
    
    // Show a brief confirmation message
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const maxQuantity = safeProducts.find(p => p.id === productId)?.stock_quantity || item.stock_quantity;
          return { ...item, quantity: Math.min(newQuantity, maxQuantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    alert('Cart cleared!');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // FIXED: Enhanced payment handling with better error handling and auth checks
  const handleProceedToPayment = () => {
    console.log('Starting checkout process...');
    console.log('Auth user:', auth?.user);
    console.log('Cart contents:', cart);
    
    // Check authentication first
    if (!auth?.user) {
      alert('Please log in to proceed with payment');
      router.visit('/login');
      return;
    }
    
    // Check cart contents
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate cart items before checkout
    const validCartItems = cart.filter(item => {
      return item.id && item.quantity > 0 && item.name && item.price;
    });

    if (validCartItems.length === 0) {
      alert('No valid items in cart');
      return;
    }

    console.log('Making checkout request with cart:', validCartItems);

    // FIXED: Added better error handling and success handling
    router.post('/checkout', 
      { 
        cart: validCartItems,
        _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') // Ensure CSRF token
      }, 
      {
        onBefore: () => {
          console.log('Checkout request starting...');
        },
        onStart: () => {
          console.log('Checkout request sent...');
        },
        onSuccess: (page) => {
          console.log('Checkout successful!', page);
          // Clear cart on successful checkout
          setCart([]);
          localStorage.removeItem('shopping_cart');
        },
        onError: (errors) => {
          console.error('Checkout error details:', errors);
          
          // Handle different types of errors
          if (errors.message) {
            alert(`Checkout error: ${errors.message}`);
          } else if (typeof errors === 'object') {
            const errorMessages = Object.values(errors).flat();
            alert(`Checkout errors:\n${errorMessages.join('\n')}`);
          } else {
            alert('Error proceeding to checkout. Please try again.');
          }
        },
        onFinish: () => {
          console.log('Checkout request finished');
        }
      }
    );
  };

  return (
    <>
      {/* Fixed Cart Icon */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowCart(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>
      
      {/* Page Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-gray-800 to-gray-700 py-20 mb-10 overflow-hidden">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          style={{ zIndex: 1 }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-gray-800/60 to-gray-400/80" style={{ zIndex: 2 }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Our Products</h1>
          <p className="text-lg md:text-xl text-white/80 mb-6">
            Discover our wide range of quality products. We have {totalProducts} products available!
          </p>
          
          {/* User greeting */}
          {auth?.user && (
            <p className="text-white/90 mb-4">
              Welcome, {auth.user.name}! Happy shopping!
            </p>
          )}
          
          {/* Search Bar */}
          <div className="w-full max-w-md mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Scroll Down Animation */}
          <div className="mt-16 flex flex-col items-center animate-bounce">
            <span className="text-white font-semibold text-base mb-1 drop-shadow">Scroll down to view products</span>
            <svg className="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="text-center mb-6">
          <p className="text-slate-600">
            Showing {safeProducts.length} of {totalProducts} products
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-slate-700 mr-2">Category:</span>
            {['All', ...safeCategories].map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-semibold border transition ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Availability Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-slate-700 mr-2">Availability:</span>
            {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(availability => (
              <button
                key={availability}
                className={`px-4 py-2 rounded-full font-semibold border transition ${
                  selectedAvailability === availability
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                }`}
                onClick={() => setSelectedAvailability(availability)}
              >
                {availability}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Cards */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {safeProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                {totalProducts === 0 ? 'No Products Found' : 'No Products Match Your Filters'}
              </h3>
              <p className="text-gray-500 mb-4">
                {totalProducts === 0 
                  ? 'There are no products in the database yet.'
                  : 'Try adjusting your filters or search terms to find products.'
                }
              </p>
              {totalProducts === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>To add products:</strong><br />
                    Run <code className="bg-blue-100 px-2 py-1 rounded font-mono">php artisan db:seed --class=ProductSeeder</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col">
                {/* Product Image */}
                <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full bg-gray-200 flex items-center justify-center"
                    style={{ display: product.image_url ? 'none' : 'flex' }}
                  >
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                
                {/* Price */}
                <div className="text-2xl font-bold text-green-600 mb-3">
                  {formatPrice(product.price)}
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                  {getAvailabilityBadge(product)}
                </div>
                
                {/* Stock Quantity */}
                <div className="text-sm text-slate-600 mb-3">
                  <strong>Stock:</strong> {product.stock_quantity} units
                </div>
                
                {/* Short Description */}
                {product.description && (
                  <div className="text-sm text-slate-500 mb-4 flex-grow">
                    <div className="line-clamp-3">
                      {product.description.length > 120 
                        ? `${product.description.substring(0, 120)}...` 
                        : product.description
                      }
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setModalProduct(product)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-900 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity <= 0}
                    className={`flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 ${
                      product.stock_quantity <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-900">Shopping Cart ({getCartItemCount()} items)</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-96 p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-600">{item.category}</p>
                        <p className="font-semibold text-green-600">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 font-bold"
                          disabled={item.quantity >= item.stock_quantity}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total: {formatPrice(getCartTotal())}</span>
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCart(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      handleProceedToPayment();
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center"
              onClick={() => setModalProduct(null)}
              aria-label="Close"
            >
              ×
            </button>
            
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              {/* Product Image */}
              <div className="w-full h-60 mb-6 overflow-hidden rounded-2xl">
                {modalProduct.image_url ? (
                  <img
                    src={modalProduct.image_url}
                    alt={modalProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{modalProduct.name}</h2>
              
              <div className="text-3xl font-bold text-green-600 mb-6">
                {formatPrice(modalProduct.price)}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {modalProduct.category}
                </span>
                {getAvailabilityBadge(modalProduct)}
                <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                  Stock: {modalProduct.stock_quantity} units
                </span>
              </div>
              
              {/* Description */}
              {modalProduct.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Description:</h3>
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{modalProduct.description}</ReactMarkdown>
                  </div>
                </div>
              )}
              
              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Product Details:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>ID:</strong> #{modalProduct.id}</div>
                  <div><strong>Category:</strong> {modalProduct.category}</div>
                  <div><strong>Price:</strong> {formatPrice(modalProduct.price)}</div>
                  <div><strong>Stock:</strong> {modalProduct.stock_quantity} units</div>
                  {modalProduct.created_at && (
                    <div><strong>Added:</strong> {new Date(modalProduct.created_at).toLocaleDateString()}</div>
                  )}
                  {modalProduct.updated_at && (
                    <div><strong>Updated:</strong> {new Date(modalProduct.updated_at).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  className="flex-1 px-6 py-3 rounded-full bg-gray-200 text-slate-900 font-semibold shadow hover:bg-gray-300 transition"
                  onClick={() => setModalProduct(null)}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCart(modalProduct);
                    setModalProduct(null);
                  }}
                  disabled={modalProduct.stock_quantity <= 0}
                  className={`flex-1 px-6 py-3 rounded-full font-semibold shadow transition ${
                    modalProduct.stock_quantity <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {modalProduct.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUpModal 0.4s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUpModal {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Footer />
    </>
  );
}

Products.layout = (page) => <Layout children={page} />;

export default Products;