function Footer() {
  return (
    <footer className="w-full min-h-[180px] bg-gradient-to-r from-slate-900 via-blue-900 to-blue-500 text-white py-10 shadow-lg mt-0">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 h-full">
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-2xl font-bold tracking-wide mb-2">FESTORA</span>
          <p className="text-sm text-blue-100">&copy; {new Date().getFullYear()} Festora. All rights reserved.</p>
        </div>
        {/* Center: Navigation Links */}
        <div className="flex flex-col items-center">
          <nav className="flex flex-wrap gap-4 mb-2">
            <a href="#" className="hover:text-blue-300 transition text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300 transition text-sm">Terms of Service</a>
            <a href="#" className="hover:text-blue-300 transition text-sm">Contact Us</a>
          </nav>
          <span className="text-xs text-blue-200">Designed & built with ❤️ in Sri Lanka</span>
        </div>
        {/* Right: Social Media */}
        <div className="flex flex-col items-center md:items-end">
          <span className="font-semibold mb-2">Follow us</span>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="hover:text-blue-300 transition">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.019 3.676 9.167 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.324 21.167 22 17.019 22 12"></path></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-blue-300 transition">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.387 3.678 1.368c-.98.98-1.237 2.092-1.296 3.373C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.316 2.393 1.296 3.373.981.981 2.093 1.237 3.373 1.296C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.316 3.373-1.296.981-.98 1.237-2.092 1.296-3.373.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.316-2.393-1.296-3.373-.98-.981-2.092-1.237-3.373-1.296C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"></path></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-300 transition">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161c-.542.929-.855 2.01-.855 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;