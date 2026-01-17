import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Head, usePage, router } from '@inertiajs/react';
import Layout from '../Layouts/Layouts';
import Footer from '../Components/Footer';

// Login Modal Component
function LoginModal({ show, onClose }) {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		remember: false,
	});
	const [errors, setErrors] = useState({});
	const [processing, setProcessing] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setProcessing(true);
		setErrors({});

		router.post('/login', formData, {
			onSuccess: () => {
				onClose();
				setProcessing(false);
				window.location.reload(); // Refresh to show user data
			},
			onError: (errors) => {
				setErrors(errors);
				setProcessing(false);
			},
		});
	};

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	if (!show) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-2xl"
					>
						×
					</button>
				</div>
				
				<p className="text-gray-600 mb-6">Please log in to complete your purchase.</p>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => handleChange('email', e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
							placeholder="you@example.com"
							required
						/>
						{errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
					</div>

					<div className="relative">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={(e) => handleChange('password', e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
							placeholder="••••••••"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-8 text-gray-500 hover:text-blue-700"
						>
							{showPassword ? (
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.907-4.568M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.198 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
								</svg>
							)}
						</button>
						{errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
					</div>

					<div className="flex items-center">
						<input
							id="remember"
							type="checkbox"
							checked={formData.remember}
							onChange={(e) => handleChange('remember', e.target.checked)}
							className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
						/>
						<label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
							Remember me
						</label>
					</div>

					<button
						type="submit"
						disabled={processing}
						className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
					>
						{processing ? 'Logging in...' : 'Log In'}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Don't have an account?{' '}
						<button
							onClick={() => router.get('/register')}
							className="text-blue-700 hover:underline font-semibold"
						>
							Register here
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}

// Payment Form Component
function PaymentForm({ orderData, onSuccess, onFailure }) {
	const { auth } = usePage().props;
	const [formData, setFormData] = useState({
		name: auth.user?.name || '',
		email: auth.user?.email || '',
		phone: '',
		address: '',
		city: '',
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		cardType: 'Visa',
		billingAddress: '',
	});
	const [processing, setProcessing] = useState(false);

	const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover'];

	const handleInputChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const formatCardNumber = (value) => {
		// Remove all non-digits
		const digits = value.replace(/\D/g, '');
		// Add spaces every 4 digits
		const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
		return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
	};

	const formatExpiryDate = (value) => {
		// Remove all non-digits
		const digits = value.replace(/\D/g, '');
		// Add slash after 2 digits
		if (digits.length >= 2) {
			return digits.substring(0, 2) + '/' + digits.substring(2, 4);
		}
		return digits;
	};

	const validateForm = () => {
		const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'cardNumber', 'expiryDate', 'cvv'];
		for (let field of requiredFields) {
			if (!formData[field] || formData[field].trim() === '') {
				return false;
			}
		}
		
		// Validate card number (should have 16 digits)
		const cardDigits = formData.cardNumber.replace(/\D/g, '');
		if (cardDigits.length !== 16) {
			return false;
		}

		// Validate expiry date format
		const expiryRegex = /^\d{2}\/\d{2}$/;
		if (!expiryRegex.test(formData.expiryDate)) {
			return false;
		}

		// Validate CVV (3 or 4 digits)
		if (formData.cvv.length < 3 || formData.cvv.length > 4) {
			return false;
		}

		return true;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			onFailure({ error: 'Please fill all required fields correctly.' });
			return;
		}

		setProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			const transactionId = Math.random().toString(36).slice(2, 10).toUpperCase();
			onSuccess({
				...formData,
				transactionId,
			});
			setProcessing(false);
		}, 2000);
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
			<h3 className="font-bold text-xl mb-6 text-gray-900">Payment & Shipping Details</h3>
			
			{/* Shipping Information */}
			<div className="mb-6">
				<h4 className="font-semibold text-lg mb-4 text-gray-800">Shipping Information</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">Full Name *</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
						<input
							type="email"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.email}
							onChange={(e) => handleInputChange('email', e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">Phone *</label>
						<input
							type="tel"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.phone}
							onChange={(e) => handleInputChange('phone', e.target.value)}
							placeholder="+94 XX XXX XXXX"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.city}
							onChange={(e) => handleInputChange('city', e.target.value)}
							placeholder="Colombo, Kandy, etc."
							required
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-medium mb-1 text-gray-700">Address *</label>
						<textarea
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows="2"
							value={formData.address}
							onChange={(e) => handleInputChange('address', e.target.value)}
							placeholder="Enter your full shipping address"
							required
						/>
					</div>
				</div>
			</div>

			{/* Payment Information */}
			<div className="mb-6">
				<h4 className="font-semibold text-lg mb-4 text-gray-800">Payment Information</h4>
				<div className="grid grid-cols-1 gap-4">
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">Card Type *</label>
						<select
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.cardType}
							onChange={(e) => handleInputChange('cardType', e.target.value)}
							required
						>
							{cardTypes.map(type => (
								<option key={type} value={type}>{type}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">Card Number *</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={formData.cardNumber}
							onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
							placeholder="1234 5678 9012 3456"
							maxLength="19"
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1 text-gray-700">Expiry Date *</label>
							<input
								type="text"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={formData.expiryDate}
								onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
								placeholder="MM/YY"
								maxLength="5"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1 text-gray-700">CVV *</label>
							<input
								type="text"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={formData.cvv}
								onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
								placeholder="123"
								maxLength="4"
								required
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1 text-gray-700">Billing Address (if different)</label>
						<textarea
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows="2"
							value={formData.billingAddress}
							onChange={(e) => handleInputChange('billingAddress', e.target.value)}
							placeholder="Leave blank if same as shipping address"
						/>
					</div>
				</div>
			</div>

			<button
				type="submit"
				disabled={processing}
				className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{processing ? (
					<span className="flex items-center justify-center">
						<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Processing Payment...
					</span>
				) : (
					`Pay Now - ${orderData.currency} ${orderData.total.toLocaleString()}`
				)}
			</button>
		</form>
	);
}

function Checkout({ cart = [] }) {
	const { auth } = usePage().props;
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [orderData, setOrderData] = useState(null);
	const [paymentSuccessData, setPaymentSuccessData] = useState(null);
	const [modal, setModal] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	// Load cart from localStorage if not provided via props
	const [currentCart, setCurrentCart] = useState([]);

	useEffect(() => {
		if (cart && cart.length > 0) {
			setCurrentCart(cart);
		} else {
			const savedCart = localStorage.getItem('shopping_cart');
			if (savedCart) {
				setCurrentCart(JSON.parse(savedCart));
			}
		}
	}, [cart]);

	// Check authentication on mount
	useEffect(() => {
		if (!auth.user && currentCart.length > 0) {
			setShowLoginModal(true);
		}
	}, [auth.user, currentCart]);

	const formatPrice = (price) => {
		const numPrice = parseFloat(price);
		return new Intl.NumberFormat('en-LK', {
			style: 'currency',
			currency: 'LKR',
			minimumFractionDigits: 2,
		}).format(isNaN(numPrice) ? 0 : numPrice);
	};

	const calculateSubtotal = () => {
		return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
	};

	const calculateShipping = () => {
		const subtotal = calculateSubtotal();
		if (subtotal >= 10000) return 0; // Free shipping over LKR 10,000
		return 500; // Standard shipping
	};

	const calculateTotal = () => {
		return calculateSubtotal() + calculateShipping();
	};

	const generateOrderData = () => {
		return {
			items: currentCart,
			subtotal: calculateSubtotal(),
			shipping: calculateShipping(),
			total: calculateTotal(),
			currency: 'LKR',
			itemCount: currentCart.reduce((count, item) => count + item.quantity, 0),
		};
	};

	const handlePaymentSuccess = async (paymentData) => {
		const transactionId = paymentData.transactionId;
		const orderDetails = generateOrderData();
		
		// Get CSRF token
		const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
		
		if (!csrfToken) {
			console.error('CSRF token not found');
			setModal({
				show: true,
				message: 'Security token missing. Please refresh the page and try again.',
				variant: 'danger',
			});
			return;
		}
		
		// Save order to database
		try {
			const orderPayload = {
				user_id: auth.user.id,
				total_amount: orderDetails.total,
				shipping_amount: orderDetails.shipping,
				currency: orderDetails.currency,
				transaction_id: transactionId,
				payment_method: 'card',
				card_type: paymentData.cardType,
				customer_name: paymentData.name,
				customer_email: paymentData.email,
				customer_phone: paymentData.phone,
				shipping_address: paymentData.address,
				shipping_city: paymentData.city,
				billing_address: paymentData.billingAddress || paymentData.address,
				order_items: currentCart.map(item => ({
					product_id: item.id,
					product_name: item.name,
					quantity: item.quantity,
					unit_price: item.price,
					total_price: item.price * item.quantity,
				})),
				order_status: 'completed',
			};

			console.log('Sending order data:', orderPayload);

			const response = await fetch('/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': csrfToken,
					'Accept': 'application/json',
				},
				body: JSON.stringify(orderPayload),
			});

			console.log('Response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('HTTP Error Response:', errorText);
				throw new Error(`HTTP ${response.status}: ${errorText}`);
			}

			let result;
			try {
				result = await response.json();
				console.log('Parsed response:', result);
			} catch (parseError) {
				console.error('Failed to parse JSON response:', parseError);
				throw new Error('Invalid response format from server');
			}

			if (result.success) {
				setModal({
					show: true,
					message: `Thank you for your purchase! Your order has been placed successfully.`,
					variant: 'success',
				});
				
				setPaymentSuccessData({
					...paymentData,
					...orderDetails,
					orderId: result.order_id,
					date: new Date().toLocaleString(),
				});

				// Clear cart
				localStorage.removeItem('shopping_cart');
				setCurrentCart([]);
			} else {
				console.error('Server returned success=false:', result);
				throw new Error(result.message || 'Failed to save order');
			}
		} catch (error) {
			console.error('Error saving order:', error);
			
			setModal({
				show: true,
				message: `Error details: ${error.message}. Please contact support with Transaction ID: ${transactionId}`,
				variant: 'danger',
			});
			
			// Still show success data so user has their receipt
			setPaymentSuccessData({
				...paymentData,
				...orderDetails,
				date: new Date().toLocaleString(),
			});
		}
	};

	const handlePaymentFailure = (error) => {
		setModal({
			show: true,
			message: error.error || 'Payment failed. Please check your payment details and try again.',
			variant: 'danger',
		});
	};

	const downloadReceipt = () => {
		if (!paymentSuccessData) return;
		
		const doc = new jsPDF();
		doc.setFontSize(16);
		doc.text('Order Receipt', 20, 20);
		
		doc.setFontSize(12);
		doc.text(`Order ID: ${paymentSuccessData.orderId || 'N/A'}`, 20, 40);
		doc.text(`Customer: ${paymentSuccessData.name}`, 20, 50);
		doc.text(`Email: ${paymentSuccessData.email}`, 20, 60);
		doc.text(`Phone: ${paymentSuccessData.phone}`, 20, 70);
		doc.text(`Address: ${paymentSuccessData.address}, ${paymentSuccessData.city}`, 20, 80);
		doc.text(`Card Type: ${paymentSuccessData.cardType}`, 20, 90);
		doc.text(`Transaction ID: ${paymentSuccessData.transactionId}`, 20, 100);
		doc.text(`Date: ${paymentSuccessData.date}`, 20, 110);
		
		doc.text('Items:', 20, 130);
		let yPosition = 140;
		paymentSuccessData.items.forEach(item => {
			doc.text(`${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`, 20, yPosition);
			yPosition += 10;
		});
		
		doc.text(`Subtotal: ${formatPrice(paymentSuccessData.subtotal)}`, 20, yPosition + 10);
		doc.text(`Shipping: ${formatPrice(paymentSuccessData.shipping)}`, 20, yPosition + 20);
		doc.text(`Total: ${formatPrice(paymentSuccessData.total)}`, 20, yPosition + 30);
		
		doc.save(`order-receipt-${paymentSuccessData.transactionId}.pdf`);
	};

	// Redirect if cart is empty
	if (currentCart.length === 0 && !paymentSuccessData) {
		return (
			<>
				<Head title="Checkout - Cart Empty" />
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md mx-auto text-center">
						<svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
						</svg>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
						<p className="text-gray-600 mb-6">Add some products to your cart to proceed with checkout.</p>
						<button
							onClick={() => router.get('/products')}
							className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Head title="Checkout" />
			
			{/* Login Modal */}
			<LoginModal 
				show={showLoginModal} 
				onClose={() => setShowLoginModal(false)} 
			/>

			{/* Modal */}
			{modal.show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 text-center">
						<h4 className={`font-bold mb-2 text-xl ${modal.variant === 'success' ? 'text-green-700' : 'text-red-700'}`}>
							{modal.variant === 'success' ? 'Order Successful!' : 'Error'}
						</h4>
						<p className="mb-4 text-gray-700">{modal.message}</p>
						<button
							className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
							onClick={() => setModal({ ...modal, show: false })}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Payment Success Section */}
			{paymentSuccessData && (
				<div className="min-h-screen bg-gray-50 py-8">
					<div className="max-w-4xl mx-auto px-4">
						<div className="bg-white rounded-2xl shadow-lg p-8 text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
							<p className="text-gray-600 mb-2">Thank you for your purchase, {paymentSuccessData.name}!</p>
							<p className="text-gray-600 mb-6">
								<strong>Order ID:</strong> {paymentSuccessData.orderId || 'N/A'} | 
								<strong> Transaction ID:</strong> {paymentSuccessData.transactionId}
							</p>
							
							<div className="bg-gray-50 rounded-xl p-6 mb-6 text-left max-w-2xl mx-auto">
								<h3 className="font-semibold text-lg mb-4">Order Summary</h3>
								{paymentSuccessData.items.map(item => (
									<div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
										<span>{item.name} x{item.quantity}</span>
										<span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
									</div>
								))}
								<div className="mt-4 pt-4 border-t border-gray-300">
									<div className="flex justify-between items-center mb-2">
										<span>Subtotal:</span>
										<span>{formatPrice(paymentSuccessData.subtotal)}</span>
									</div>
									<div className="flex justify-between items-center mb-2">
										<span>Shipping:</span>
										<span>{formatPrice(paymentSuccessData.shipping)}</span>
									</div>
									<div className="flex justify-between items-center font-bold text-lg">
										<span>Total:</span>
										<span>{formatPrice(paymentSuccessData.total)}</span>
									</div>
								</div>
							</div>
							
							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
								<button
									className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
									onClick={downloadReceipt}
								>
									Download Receipt (PDF)
								</button>
								<button
									className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
									onClick={() => router.get('/products')}
								>
									Continue Shopping
								</button>
								<button
									className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
									onClick={() => setPaymentSuccessData(null)}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Checkout Form */}
			{!paymentSuccessData && (
				<div className="min-h-screen bg-gray-50 py-8">
					<div className="max-w-7xl mx-auto px-4">
						{/* Header */}
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
							<p className="text-gray-600">Complete your order securely</p>
						</div>

						{!auth.user && (
							<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-4xl mx-auto">
								<div className="flex">
									<div className="flex-shrink-0">
										<svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-yellow-700 text-sm">
											You need to log in to complete your purchase.
										</p>
									</div>
								</div>
							</div>
						)}

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
							{/* Order Summary */}
							<div className="bg-white rounded-xl shadow-lg p-6 h-fit">
								<h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
								
								{/* Cart Items */}
								<div className="space-y-4 mb-6">
									{currentCart.map(item => (
										<div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
											<div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
												<h3 className="font-semibold text-gray-900">{item.name}</h3>
												<p className="text-sm text-gray-600">{item.category}</p>
												<p className="text-sm text-gray-600">Qty: {item.quantity}</p>
											</div>
											
											<div className="text-right">
												<p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
												<p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
											</div>
										</div>
									))}
								</div>
								
								{/* Order Totals */}
								<div className="border-t pt-6">
									<div className="flex justify-between items-center mb-2">
										<span className="text-gray-600">Subtotal ({currentCart.reduce((count, item) => count + item.quantity, 0)} items):</span>
										<span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
									</div>
									<div className="flex justify-between items-center mb-2">
										<span className="text-gray-600">Shipping:</span>
										<span className="font-semibold">
											{calculateShipping() === 0 ? (
												<span className="text-green-600">Free</span>
											) : (
												formatPrice(calculateShipping())
											)}
										</span>
									</div>
									{calculateShipping() === 0 && (
										<p className="text-sm text-green-600 mb-2">Free shipping on orders over LKR 10,000!</p>
									)}
									<div className="flex justify-between items-center text-lg font-bold border-t pt-2">
										<span>Total:</span>
										<span className="text-green-600">{formatPrice(calculateTotal())}</span>
									</div>
								</div>
								
								{/* Back to Cart Button */}
								<div className="mt-6">
									<button
										onClick={() => router.get('/products')}
										className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
									>
										← Back to Products
									</button>
								</div>
							</div>

							{/* Payment Form */}
							<div>
								{auth.user ? (
									<PaymentForm
										orderData={generateOrderData()}
										onSuccess={handlePaymentSuccess}
										onFailure={handlePaymentFailure}
									/>
								) : (
									<div className="bg-white rounded-xl shadow-lg p-6 text-center">
										<svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
										<h3 className="text-xl font-bold text-gray-900 mb-4">Login Required</h3>
										<p className="text-gray-600 mb-6">Please log in to your account to proceed with the payment.</p>
										<button
											onClick={() => setShowLoginModal(true)}
											className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
										>
											Login to Continue
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</>
	);
}

Checkout.layout = (page) => <Layout children={page} />;

export default Checkout;