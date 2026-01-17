import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
<meta name="csrf-token" content="{{ csrf_token() }}"></meta>
export default function Layout({ children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { auth } = usePage().props;

  return (
    <div>
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-blue-500 shadow-lg z-50">
        <nav className="w-full flex items-center justify-between py-4 pl-40 pr-20">
          <a href="/" className="text-2xl font-bold tracking-wide text-white drop-shadow-lg font-poppins">
            FESTORA
          </a>
          <div className="flex items-center space-x-2">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/festivals">Festivals</Link>
            <Link className="nav-link" href="/products">Products</Link>
            <Link className="nav-link" href="/donate">Donate</Link>
            <Link className="nav-link" href="/#about">About Us</Link>
            {/* User Icon Dropdown */}
            <div className="relative">
              <button
                className="round-btn flex items-center justify-center"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="User menu"
              >
                {/* Heroicons user icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                  {auth.user ? (
                    <>
                      <Link href="/profile" className="block px-10 py-2 text-sm text-slate-700 rounded-md nav-link">Profile</Link>
                      <Link href="/logout" method="post" as="button" className="block px-10 py-2 text-sm text-slate-700 rounded-md nav-link">Logout</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm text-slate-700 rounded-md nav-link">Login</Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-slate-700 rounded-md nav-link">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="pt-20 pb-10">
        {children}
      </main>
    </div>
  );
}
