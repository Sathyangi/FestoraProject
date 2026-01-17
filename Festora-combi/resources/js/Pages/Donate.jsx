import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Head, usePage, router } from '@inertiajs/react';
import Layout from '../Layouts/Layouts';
import Footer from '../Components/Footer';
import Donation from '../../assets/donation.jpg';

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
				
				<p className="text-gray-600 mb-6">Please log in to complete your donation.</p>
				
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

// Top-level, modern, professional donation page
const organizations = [
	{
		id: 'cancer-hospital',
		name: 'Apeksha Hospital (National Cancer Hospital)',
		description:
			'Premier cancer treatment and research facility in Sri Lanka. Donations support patient care, equipment, and supplies.',
		website: 'https://www.apeksahospital.lk/',
	},
	{
		id: 'childrens-hospital',
		name: 'Lady Ridgeway Hospital for Children (LRH)',
		description:
			'Largest tertiary care children\'s hospital in Sri Lanka. Contributions help provide essential care and facilities for children.',
		website: 'https://lrh.health.gov.lk/',
	},
	{
		id: 'elderly-care',
		name: 'HelpAge Sri Lanka',
		description:
			'Supports disadvantaged elderly individuals. Donations assist with medical care, spectacles, and elder care homes.',
		website: 'https://helpagesl.org/',
	},
	{
		id: 'disaster-relief',
		name: 'Sri Lanka Red Cross Society',
		description:
			'Provides humanitarian aid, disaster relief, and health services to vulnerable communities.',
		website: 'https://www.redcross.lk/',
	},
	{
		id: 'cultural-heritage',
		name: 'Department of Archaeology, Sri Lanka',
		description:
			'Supports preservation of Sri Lanka\'s archaeological heritage, temples, ruins, and historical sites.',
		website: 'http://www.archaeology.gov.lk/',
	},
];

function Donate() {
	const { auth } = usePage().props;
	const [donationAmount, setDonationAmount] = useState('');
	const [selectedOrganization, setSelectedOrganization] = useState('');
	const [currentDonationTarget, setCurrentDonationTarget] = useState(null);
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [donationData, setDonationData] = useState(null);
	const [paymentSuccessData, setPaymentSuccessData] = useState(null);
	const [modal, setModal] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	// Dummy payment form for demonstration
	function PaymentForm({ donationData, onSuccess, onFailure }) {
		const [name, setName] = useState(auth.user?.name || '');
		const [card, setCard] = useState('');
		
		return (
			<form
				className="bg-white rounded-xl shadow-lg p-6"
				onSubmit={(e) => {
					e.preventDefault();
					if (!name || !card) {
						onFailure({ error: 'Please fill all payment fields.' });
						return;
					}
					onSuccess({
						name,
						cardType: 'Visa',
						transactionId: Math.random().toString(36).slice(2, 10).toUpperCase(),
					});
				}}
			>
				<h3 className="font-bold text-lg mb-4">Payment Details</h3>
				<div className="mb-3">
					<label className="block text-sm font-medium mb-1">Name on Card</label>
					<input
						className="w-full border rounded px-3 py-2"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="block text-sm font-medium mb-1">Card Number</label>
					<input
						className="w-full border rounded px-3 py-2"
						value={card}
						onChange={(e) => setCard(e.target.value)}
						placeholder="1234 5678 9012 3456"
						required
					/>
				</div>
				<div className="grid grid-cols-2 gap-3 mb-3">
					<div>
						<label className="block text-sm font-medium mb-1">Expiry Date</label>
						<input
							className="w-full border rounded px-3 py-2"
							placeholder="MM/YY"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">CVV</label>
						<input
							className="w-full border rounded px-3 py-2"
							placeholder="123"
							maxLength="3"
							required
						/>
					</div>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition"
				>
					Pay Now
				</button>
			</form>
		);
	}

	// Handle donation form submit
	const handleDonationSubmit = (e) => {
		e.preventDefault();
		
		// Check if user is authenticated
		if (!auth.user) {
			setShowLoginModal(true);
			return;
		}

		if (!donationAmount || !selectedOrganization) {
			setModal({
				show: true,
				message: 'Please enter a donation amount and select an organization.',
				variant: 'danger',
			});
			return;
		}
		const amount = parseFloat(donationAmount);
		if (isNaN(amount) || amount <= 0) {
			setModal({
				show: true,
				message: 'Please enter a valid positive donation amount.',
				variant: 'danger',
			});
			return;
		}
		const org = organizations.find((o) => o.id === selectedOrganization);
		setDonationData({
			amount,
			organizationId: selectedOrganization,
			organizationName: org?.name || selectedOrganization,
			currency: 'LKR',
		});
		setShowPaymentForm(true);
	};

	// Handle organization select
	const handleSelectOrganizationForDonation = (orgId, orgName) => {
		setSelectedOrganization(orgId);
		setCurrentDonationTarget({ id: orgId, name: orgName });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Payment success - now saves to database

const handlePaymentSuccess = async (paymentData) => {
	const transactionId = paymentData.transactionId;
	
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
	
	// Save donation to database
	try {
		console.log('Sending donation data:', {
			organization_id: donationData.organizationId,
			organization_name: donationData.organizationName,
			amount: donationData.amount,
			currency: donationData.currency,
			transaction_id: transactionId,
			payment_method: 'card',
			card_type: paymentData.cardType,
			donor_name: paymentData.name,
		});

		const response = await fetch('/donations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': csrfToken,
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				organization_id: donationData.organizationId,
				organization_name: donationData.organizationName,
				amount: donationData.amount,
				currency: donationData.currency,
				transaction_id: transactionId,
				payment_method: 'card',
				card_type: paymentData.cardType,
				donor_name: paymentData.name,
			}),
		});

		console.log('Response status:', response.status);
		console.log('Response headers:', response.headers);

		// Check if response is ok
		if (!response.ok) {
			const errorText = await response.text();
			console.error('HTTP Error Response:', errorText);
			throw new Error(`HTTP ${response.status}: ${errorText}`);
		}

		// Try to parse JSON response
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
				message: `Thank you for your generous donation of LKR ${donationData.amount.toLocaleString()} to ${donationData.organizationName}!`,
				variant: 'success',
			});
			setPaymentSuccessData({
				...paymentData,
				amount: donationData.amount,
				currency: donationData.currency,
				organizationName: donationData.organizationName,
				date: new Date().toLocaleString(),
			});
		} else {
			console.error('Server returned success=false:', result);
			throw new Error(result.message || 'Failed to save donation');
		}
	} catch (error) {
		console.error('Error saving donation:', error);
		
		// Show detailed error message for debugging
		setModal({
			show: true,
			message: `Error details: ${error.message}. Please contact support with Transaction ID: ${transactionId}`,
			variant: 'danger',
		});
		
		// Still show success data so user has their receipt
		setPaymentSuccessData({
			...paymentData,
			amount: donationData.amount,
			currency: donationData.currency,
			organizationName: donationData.organizationName,
			date: new Date().toLocaleString(),
		});
	}

	// Reset form data
	setDonationAmount('');
	setSelectedOrganization('');
	setCurrentDonationTarget(null);
	setShowPaymentForm(false);
	setDonationData(null);
};

	// Payment failure
	const handlePaymentFailure = (error) => {
		setModal({
			show: true,
			message: error.error || 'Payment failed. Please check your payment details and try again.',
			variant: 'danger',
		});
	};

	// Download PDF receipt
	const downloadReceipt = () => {
		if (!paymentSuccessData) return;
		const doc = new jsPDF();
		doc.setFontSize(16);
		doc.text('🎉 Donation Receipt', 20, 20);
		doc.setFontSize(12);
		doc.text(`Organization: ${paymentSuccessData.organizationName}`, 20, 40);
		doc.text(`Donor: ${paymentSuccessData.name || 'N/A'}`, 20, 50);
		doc.text(`Card Type: ${paymentSuccessData.cardType || 'N/A'}`, 20, 60);
		doc.text(`Amount: ${paymentSuccessData.currency} ${paymentSuccessData.amount.toLocaleString()}`, 20, 70);
		doc.text(`Date: ${paymentSuccessData.date}`, 20, 80);
		doc.text(`Transaction ID: ${paymentSuccessData.transactionId || 'N/A'}`, 20, 90);
		doc.save('donation-receipt.pdf');
	};

	return (
		<>
			<Head title="Donate to Sri Lankan Causes" />
			
			{/* Login Modal */}
			<LoginModal 
				show={showLoginModal} 
				onClose={() => setShowLoginModal(false)} 
			/>

			{/* Page Header*/}
			<header className="relative bg-black py-8 mb-6 overflow-hidden">
				<img
					src={Donation}
					alt=""
					className="absolute inset-0 w-full h-full object-cover opacity-40"
					style={{ zIndex: 1 }}
					aria-hidden="true"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/60 to-gray-700/80" style={{ zIndex: 2 }} />
				<div className="relative max-w-4xl mx-auto px-4 text-center z-10 flex flex-col items-center">
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Donate to Sri Lankan Causes</h1>
					<p className="text-lg md:text-xl text-gray-200 mb-6">
						Make a difference by supporting cultural, humanitarian, and community initiatives across Sri Lanka.
					</p>
					{auth.user && (
						<p className="text-green-300 font-semibold mb-4">
							Welcome back, {auth.user.name}! Ready to make a difference?
						</p>
					)}
					<div className="mt-8 flex flex-col items-center animate-bounce">
						<span className="text-white font-semibold text-base mb-1 drop-shadow">Scroll down to donate</span>
						<svg className="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
			</header>
			
			<div className="max-w-5xl mx-auto px-4 py-10">
				{/* Modal */}
				{modal.show && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
							<h4 className={`font-bold mb-2 ${modal.variant === 'success' ? 'text-green-700' : 'text-red-700'}`}>
								{modal.variant === 'success' ? 'Success' : 'Error'}
							</h4>
							<p className="mb-4 text-gray-700">{modal.message}</p>
							<button
								className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition"
								onClick={() => setModal({ ...modal, show: false })}
							>
								Close
							</button>
						</div>
					</div>
				)}

				{/* Payment Success Section */}
				{paymentSuccessData && (
					<div className="text-center my-8">
						<h3 className="text-green-700 font-bold text-xl mb-2">✅ Payment Successful!</h3>
						<p className="text-gray-800">
							Thank you for your donation to <strong>{paymentSuccessData.organizationName}</strong>.
						</p>
						<p className="text-gray-600">
							<strong>Transaction ID:</strong> {paymentSuccessData.transactionId || 'N/A'}
						</p>
						<div className="mt-4 space-x-2">
							<button
								className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition"
								onClick={downloadReceipt}
							>
								Download Receipt (PDF)
							</button>
							<button
								className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700 transition"
								onClick={() => setPaymentSuccessData(null)}
							>
								Close
							</button>
						</div>
					</div>
				)}

				{/* Main Content */}
				{!showPaymentForm ? (
					<>
						<h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900">
							Support Cultural & Humanitarian Initiatives
						</h1>
						<p className="text-center text-gray-600 mb-8">
							Your generous contributions help preserve Sri Lanka's rich cultural heritage and support vital community
							services for those in need.
						</p>

						<div className="bg-white rounded-2xl shadow-lg p-8 mb-10 max-w-lg mx-auto">
							<h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Make a Donation</h2>
							{!auth.user && (
								<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
									<div className="flex">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-yellow-700 text-sm">
												You'll need to log in to complete your donation.
											</p>
										</div>
									</div>
								</div>
							)}
							<form onSubmit={handleDonationSubmit} className="space-y-6">
								<div>
									<label htmlFor="donationAmount" className="block font-semibold mb-1 text-gray-800">
										Donation Amount (LKR)
									</label>
									<input
										type="number"
										id="donationAmount"
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
										placeholder="e.g., 500, 1000, 5000"
										value={donationAmount}
										onChange={(e) => setDonationAmount(e.target.value)}
										min="1"
										required
									/>
								</div>
								<div>
									<label htmlFor="selectOrganization" className="block font-semibold mb-1 text-gray-800">
										Donate to:
									</label>
									<select
										id="selectOrganization"
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
										value={selectedOrganization}
										onChange={(e) => {
											const selectedOrg = organizations.find((org) => org.id === e.target.value);
											setSelectedOrganization(e.target.value);
											setCurrentDonationTarget(selectedOrg ? { id: selectedOrg.id, name: selectedOrg.name } : null);
										}}
										required
									>
										<option value="">Select an organization or cause</option>
										{organizations.map((org) => (
											<option key={org.id} value={org.id}>
												{org.name}
											</option>
										))}
									</select>
									{currentDonationTarget && (
										<div className="mt-2 text-gray-700 text-sm">
											You are donating to: <strong>{currentDonationTarget.name}</strong>
										</div>
									)}
								</div>
								<button
									type="submit"
									className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition"
								>
									{auth.user ? 'Proceed to Payment' : 'Proceed to Payment'}
								</button>
							</form>
						</div>

						{/* Featured Organizations */}
						<h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
							Explore Featured Organizations in Sri Lanka
						</h2>
						<p className="text-center text-gray-600 mb-4">
							These reputable organizations make a significant impact in Sri Lanka's humanitarian and cultural sectors.
							Click "Donate" to pre-select them above.
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
							{organizations.map((org) => (
								<div key={org.id} className="bg-white rounded-xl shadow-lg shadow-gray-700/40 p-4 flex flex-col items-start h-full">
									<h3 className="font-bold text-base mb-1 text-gray-900">{org.name}</h3>
									<p className="text-gray-600 mb-2 text-xs">{org.description}</p>
									{org.website && (
										<a
											href={org.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-green-700 hover:underline mb-2 text-xs"
										>
											Visit Website
										</a>
									)}
									<button
										className="mt-auto w-full min-h-[36px] bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white px-2 py-1 rounded font-semibold text-xs hover:from-green-900 hover:to-green-700 transition"
										onClick={() => handleSelectOrganizationForDonation(org.id, org.name)}
									>
										Donate to {org.name}
									</button>
								</div>
							))}
						</div>
					</>
				) : (
					// Payment Form Section
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
								<h3 className="font-bold text-lg mb-4 text-gray-900">Donation Summary</h3>
								<div className="mb-2 text-gray-800">
									<strong>Organization:</strong> {donationData.organizationName}
								</div>
								<div className="mb-2 text-gray-800">
									<strong>Donor:</strong> {auth.user?.name}
								</div>
								<div className="mb-2">
									<strong>Amount:</strong>{' '}
									<span className="text-green-700 font-bold">
										{donationData.currency} {donationData.amount.toLocaleString()}
									</span>
								</div>
								<hr className="my-3" />
								<div className="flex justify-between mb-1 text-gray-700">
									<span>Donation Amount:</span>
									<span>
										{donationData.currency} {donationData.amount.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between mb-1 text-gray-700">
									<span>Processing Fee:</span>
									<span className="text-green-600">Free</span>
								</div>
								<hr className="my-2" />
								<div className="flex justify-between font-bold text-gray-900">
									<span>Total:</span>
									<span>
										{donationData.currency} {donationData.amount.toLocaleString()}
									</span>
								</div>
							</div>
							<button
								className="w-full bg-gray-500 text-white py-2 rounded font-semibold hover:bg-gray-700 transition"
								onClick={() => {
									setShowPaymentForm(false);
									setDonationData(null);
								}}
							>
								← Back to Donation Form
							</button>
						</div>
						<div>
							<PaymentForm
								donationData={donationData}
								onSuccess={handlePaymentSuccess}
								onFailure={handlePaymentFailure}
							/>
						</div>
					</div>
				)}
			</div>
			<Footer />
		</>
	);
}

Donate.layout = (page) => <Layout children={page} />;

export default Donate;