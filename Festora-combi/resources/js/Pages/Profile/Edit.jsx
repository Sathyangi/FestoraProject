import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-700 to-blue-400 rounded-full p-2 shadow-lg">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold leading-tight text-gray-800 tracking-tight font-poppins">
                        Profile Settings
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
                <div className="mx-auto max-w-5xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Info Card */}
                        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-4 flex flex-col items-center">
                            <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                Profile Info
                            </h3>
                            <p className="text-sm text-gray-900 mb-4 text-center">
                                Update your account's profile information and email address.
                            </p>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="w-full"
                            />
                        </div>

                        {/* Update Password Card */}
                        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-4 flex flex-col items-center">
                            <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 4h.01M17.657 16.657A8 8 0 118.343 7.343a8 8 0 019.314 9.314z" />
                                </svg>
                                Update Password
                            </h3>
                            <p className="text-sm text-gray-900 mb-4 text-center">
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                            <UpdatePasswordForm className="w-full" />
                        </div>

                        {/* Delete Account Card */}
                        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl p-4 flex flex-col items-center">
                            <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Delete Account
                            </h3>
                            <p className="text-sm text-gray-900 mb-4 text-center">
                                Permanently delete your account and all associated data.
                            </p>
                            <DeleteUserForm className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
