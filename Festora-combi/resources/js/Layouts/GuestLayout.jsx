import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-slate-700 px-4">
            {children}
        </div>
    );
}
