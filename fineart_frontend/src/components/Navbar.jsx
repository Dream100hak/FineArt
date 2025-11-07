'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiFeather, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { clearAuthSession } from '@/lib/auth';
import useDecodedAuth from '@/hooks/useDecodedAuth';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/artists', label: 'Artists' },
  { href: '/artworks', label: 'Artworks' },
  { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, decodedEmail, decodedRole } = useDecodedAuth();

  const handleLogout = () => {
    clearAuthSession();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
          <FiFeather className="text-primary" />
          FineArt
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`transition-colors hover:text-primary ${
                pathname === route.href ? 'text-primary' : ''
              }`}
            >
              {route.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wide text-neutral-500">
                {decodedEmail ?? '로그인됨'} ({decodedRole ?? 'guest'})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-primary px-4 py-1.5 text-primary transition hover:bg-primary hover:text-white"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-primary px-4 py-1.5 text-primary transition hover:bg-primary hover:text-white"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-md border border-neutral-300 p-2 md:hidden"
        >
          <FiMenu />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-700 md:hidden">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setIsOpen(false)}>
              {route.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <span className="text-xs uppercase tracking-wide text-neutral-500">
                {decodedEmail ?? '로그인됨'} ({decodedRole ?? 'guest'})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-primary px-4 py-1.5 text-primary transition hover:bg-primary hover:text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
