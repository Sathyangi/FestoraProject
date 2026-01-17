import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Layout from './Layouts'; // Adjust the path if needed

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <Layout>
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main className="py-8">{children}</main>
        </Layout>
    );
}
