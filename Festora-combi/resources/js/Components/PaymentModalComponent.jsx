import { useState } from 'react';
import { useCart } from '../Context/CartContext';

const PaymentModal = ({ isOpen, onClose, total, cartItems }) => {
    const { clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [selectedCard, setSelectedCard] = useState('');
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: '',
    });
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        let value = e.target.value;
        
        // Format card number with spaces every 4 digits
        if (e.target.name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (value.length > 19) value = value.substr(0, 19);
        }
        
        // Format expiry date with slash (MM/YY)
        if (e.target.name === 'expiry') {
            value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            if (value.length > 5) value = value.substr(0, 5);
        }
        
        // Format CVV (numbers only)
        if (e.target.name === 'cvv') {
            value = value.replace(/\D/g, '');
            if (value.length > 4) value = value.substr(0, 4);
        }
        
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleCardSelect = (type) => {
        setSelectedCard(type);
        setStep(2);
    };

    const validateForm = () => {
        const { cardNumber, expiry, cvv, name } = formData;
        
        if (!name.trim()) {
            alert('Please enter cardholder name');
            return false;
        }
        
        if (cardNumber.replace(/\s/g, '').length < 16) {
            alert('Invalid card number');
            return false;
        }
        
        if (expiry.length !== 5) {
            alert('Invalid expiry date');
            return false;
        }
        
        if (cvv.length < 3) {
            alert('Invalid CVV');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsProcessing(true);
        try {
            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Mock payment processing - always succeeds
            setPaymentStatus('success');
            
            // Clear cart after successful payment
            setTimeout(() => {
                clearCart();
                setPaymentStatus(null);
                setStep(1);
                setFormData({ cardNumber: '', expiry: '', cvv: '', name: '' });
                setSelectedCard('');
                onClose();
            }, 3000);
            
        } catch (err) {
            setPaymentStatus('error');
            console.error('Payment error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetModal = () => {
        setStep(1);
        setSelectedCard('');
        setFormData({ cardNumber: '', expiry: '', cvv: '', name: '' });
        setPaymentStatus(null);
        setIsProcessing(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {paymentStatus === 'success' ? 'Payment Successful!' : 'Secure Checkout'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {/* Payment Success */}
                    {paymentStatus === 'success' && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h3>
                            <p className="text-slate-600 mb-2">Thank you for your purchase.</p>
                            <p className="text-lg font-semibold">Total Paid: LKR {total.toFixed(2)}</p>
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                <p className="text-green-800 text-sm">
                                    Your order is being processed. You will receive a confirmation email shortly.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Payment Error */}
                    {paymentStatus === 'error' && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">❌</div>
                            <h3 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h3>
                            <p className="text-slate-600 mb-4">Please try again or contact support.</p>
                            <button
                                onClick={() => setPaymentStatus(null)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Payment Form */}
                    {!paymentStatus && (
                        <>
                            {/* Progress Indicator */}
                            <div className="mb-6">
                                <div className="flex items-center justify-center space-x-4">
                                    {[1, 2, 3].map((stepNum) => (
                                        <div key={stepNum} className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                step >= stepNum ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {stepNum}
                                            </div>
                                            {stepNum < 3 && (
                                                <div className={`w-12 h-0.5 ${
                                                    step > stepNum ? 'bg-green-600' : 'bg-slate-200'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-slate-600">
                                    <span>Card Type</span>
                                    <span>Details</span>
                                    <span>Confirm</span>
                                </div>
                            </div>

                            {/* Step 1: Card Type Selection */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-center">Select Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleCardSelect('Visa')}
                                            className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
                                        >
                                            <div className="text-center">
                                                <div className="w-16 h-10 bg-blue-600 rounded mx-auto mb-3 flex items-center justify-center text-white font-bold">
                                                    VISA
                                                </div>
                                                <span className="font-medium group-hover:text-blue-600">Visa Card</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleCardSelect('MasterCard')}
                                            className="p-6 border-2 border-slate-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition group"
                                        >
                                            <div className="text-center">
                                                <div className="w-16 h-10 bg-red-600 rounded mx-auto mb-3 flex items-center justify-center text-white font-bold text-xs">
                                                    MASTER
                                                </div>
                                                <span className="font-medium group-hover:text-red-600">MasterCard</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment Details */}
                            {step === 2 && (
                                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
                                    <h3 className="text-xl font-semibold text-center">Enter Payment Details</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Cardholder Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Card Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="1234 5678 9012 3456"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="MM/YY"
                                                value={formData.expiry}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                CVV *
                                            </label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="123"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                            disabled={!formData.name || !formData.cardNumber || !formData.expiry || !formData.cvv}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 3: Confirmation */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-center">Confirm Your Order</h3>
                                    
                                    {/* Order Summary */}
                                    <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                                        <h4 className="font-semibold text-slate-900">Order Summary</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-slate-600">
                                                        {item.name} × {item.quantity}
                                                    </span>
                                                    <span className="font-medium">
                                                        LKR {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total:</span>
                                                <span className="text-green-600">LKR {total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="bg-slate-50 rounded-xl p-6 space-y-2">
                                        <h4 className="font-semibold text-slate-900">Payment Details</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Card Type:</span>
                                                <span className="font-medium">{selectedCard}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Cardholder:</span>
                                                <span className="font-medium">{formData.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Card Number:</span>
                                                <span className="font-medium">**** **** **** {formData.cardNumber.slice(-4)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                                            disabled={isProcessing}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isProcessing}
                                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400"
                                        >
                                            {isProcessing ? 'Processing...' : 'Complete Payment'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;