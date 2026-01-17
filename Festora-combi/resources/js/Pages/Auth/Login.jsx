import { useState, useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import heroImage from '../../../assets/hero.jpg';

export default function Login({ status, canResetPassword, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || '', // Pre-fill email if passed from registration
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        
        console.log('Attempting login with:', { email: data.email }); // Debug log
        
        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                console.log('Login successful!');
            },
            onError: (errors) => {
                console.error('Login errors:', errors);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="w-full max-w-2xl mx-auto bg-white/95 rounded-3xl shadow-2xl shadow-blue-900/50 p-0 backdrop-blur-lg border border-blue-100 flex flex-col md:flex-row items-stretch justify-center gap-0 overflow-hidden">
                {/* Left Side: Icon and Welcome */}
                <div className="flex flex-col items-center justify-center md:w-1/2 w-full relative overflow-hidden p-10">
                    {/* Background Image */}
                    <img
                        src={heroImage}
                        alt="Login Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                        style={{ zIndex: 0 }}
                    />
                    {/* Overlay for better text contrast */}
                    <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="rounded-full bg-white/30 p-6 shadow-xl mb-6">
                            <svg width="64" height="64" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-5xl font-extrabold text-center text-white mb-4 tracking-tight font-poppins drop-shadow-2xl">
                            Welcome Back
                        </h2>
                        <p className="text-center text-white/90 text-lg mb-2 font-medium drop-shadow-lg">
                            Sign in to access your dashboard and exclusive features.
                        </p>
                        {status && (
                            <div className="mt-4 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                                <p className="text-sm font-medium text-green-800 text-center">
                                    {status}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Right Side: Form */}
                <form onSubmit={submit} className="space-y-8 md:w-1/2 w-full flex flex-col justify-center p-10">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-slate-800 font-semibold" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full border border-slate-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-lg"
                            autoComplete="username"
                            isFocused={!data.email} // Only focus if email is empty
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="relative">
                        <InputLabel htmlFor="password" value="Password" className="text-slate-800 font-semibold" />
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full border border-slate-300 rounded-xl px-5 py-4 pr-12 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-lg"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        {/* Eye toggle button */}
                        <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer mt-4">
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-slate-500 hover:text-blue-700 focus:outline-none"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.907-4.568M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.198 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                        </span>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-blue-700 underline hover:text-blue-900 transition"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <PrimaryButton
                        className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:from-blue-800 hover:to-blue-600 transition duration-200 flex justify-center"
                        disabled={processing}
                    >
                        {processing ? 'Signing In...' : 'Sign In'}
                    </PrimaryButton>
                    
                    <div className="mt-8 text-center">
                        <span className="text-gray-600 text-sm">
                            Don't have an account?
                            <Link
                                href={route('register')}
                                className="ml-2 text-blue-700 font-semibold underline hover:text-blue-900 transition"
                            >
                                Register
                            </Link>
                        </span>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <Link
                            href="/"
                            className="text-blue-700 font-semibold underline hover:text-blue-900 transition"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}