import { useState } from 'react';
import { router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import collage2 from '../../../assets/hero2.jpg';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'customer',
        phone: '',
        address: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();

        // Clean and prepare data based on user type
        const cleanData = {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            user_type: data.user_type,
        };

        // Add fields for supplier and organization
        if (data.user_type === 'supplier' || data.user_type === 'organization') {
            cleanData.phone = data.phone;
            cleanData.address = data.address;
            cleanData.description = data.description;
        }

        console.log('Submitting registration data:', cleanData);

        post(route('register'), {
            data: cleanData,
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => {
                console.log('Registration successful, redirecting to login...');
                router.visit(route('login'), {
                    data: { 
                        status: 'Registration successful! Please log in with your credentials.',
                        email: cleanData.email
                    },
                    replace: true,
                });
            },
            onError: (errors) => {
                console.error('Registration errors:', errors);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl shadow-blue-900/50 p-0 backdrop-blur-lg border border-blue-100 flex flex-col lg:flex-row items-stretch justify-center gap-0 overflow-hidden">
                {/* Left Side: Image and Welcome */}
                <div className="flex flex-col items-center justify-center lg:w-2/5 w-full relative overflow-hidden p-10">
                    <img
                        src={collage2}
                        alt="Register Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                        style={{ zIndex: 0 }}
                    />
                    <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="rounded-full bg-white/30 p-6 shadow-xl mb-6">
                            <svg width="64" height="64" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-white mb-4 tracking-tight font-poppins drop-shadow-2xl">
                            Create Account
                        </h2>
                        <p className="text-center text-white/90 text-lg mb-2 font-medium drop-shadow-lg">
                            Register to access your dashboard and exclusive features.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-3/5 w-full flex flex-col justify-center p-8 lg:p-10">
                    <form onSubmit={submit} className="space-y-5 max-h-[80vh] overflow-y-auto">
                        {/* User Type Selection */}
                        <div>
                            <InputLabel htmlFor="user_type" value="I want to register as:" className="text-slate-800 font-semibold mb-2" />
                            <select
                                id="user_type"
                                className="block w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                                value={data.user_type}
                                onChange={(e) => setData('user_type', e.target.value)}
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="supplier">Supplier</option>
                                <option value="organization">Organization</option>
                            </select>
                            <InputError message={errors.user_type} className="mt-2" />
                        </div>

                        {/* General User Fields */}
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" className="text-slate-800 font-semibold mb-2" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="block w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Enter your full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" className="text-slate-800 font-semibold mb-2" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        
                        {/* Supplier/Organization-specific fields */}
                        {(data.user_type === 'supplier' || data.user_type === 'organization') && (
                            <>
                                <div>
                                    <InputLabel htmlFor="phone" value="Phone Number" className="text-slate-800 font-semibold mb-2" />
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="block w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Your phone number"
                                        required
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="address" value="Address" className="text-slate-800 font-semibold mb-2" />
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        className="block w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition resize-none"
                                        rows="2"
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Your address"
                                        required
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value={
                                        data.user_type === 'supplier' ? 'Business Description' : 'Organization Description'
                                    } className="text-slate-800 font-semibold mb-2" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="block w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition resize-none"
                                        rows="3"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={
                                            data.user_type === 'supplier'
                                                ? 'Describe your business and products...'
                                                : 'Describe your organization and mission...'
                                        }
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </>
                        )}
                        
                        {/* Password Fields */}
                        <div className="relative">
                            <InputLabel htmlFor="password" value="Password" className="text-slate-800 font-semibold mb-2" />
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="block w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-slate-500 hover:text-blue-700 focus:outline-none"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.907-4.568M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.198 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="relative">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-800 font-semibold mb-2" />
                            <TextInput
                                id="password_confirmation"
                                type={showConfirm ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-slate-500 hover:text-blue-700 focus:outline-none"
                                tabIndex={-1}
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 612.907-4.568M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.198 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex flex-col items-center gap-4 pt-6">
                            <PrimaryButton
                                className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-800 hover:to-blue-600 transition duration-200 flex justify-center"
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </PrimaryButton>
                            <span className="text-gray-600 text-sm">
                                Already have an account?
                                <Link
                                    href={route('login')}
                                    className="ml-2 text-blue-700 font-semibold underline hover:text-blue-900 transition"
                                >
                                    Log in
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}