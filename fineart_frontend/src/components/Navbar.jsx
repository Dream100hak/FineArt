'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiFeather, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { clearAuthSession } from '@/lib/auth';
import useDecodedAuth from '@/hooks/useDecodedAuth';

const ROUTES = [
  { href: '/', label: '홈' },
  { href: '/exhibitions', label: '전시' },
  { href: '/sales', label: '세일' },
  { href: '/education', label: '교육' },
  { href: '/articles', label: '매거진' },
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

  const renderAuthBadge = () => (
    <span className="text-xs uppercase tracking-wide text-neutral-500">
      {decodedEmail ?? '로그인 안 됨'} ({decodedRole ?? 'guest'})
    </span>
  );

  const renderAuthActions = (variant = 'desktop') =>
    isAuthenticated ? (
      <div className={`flex items-center gap-3 ${variant === 'mobile' ? 'flex-col items-start' : ''}`}>
        {renderAuthBadge()}
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
        onClick={() => setIsOpen(false)}
        className="rounded-full border border-primary px-4 py-1.5 text-primary transition hover:bg-primary hover:text-white"
      >
        로그인
      </Link>
    );

  const handleRouteClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
          <FiFeather className="text-primary" />
          FineArt
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
          {ROUTES.map((route) => (
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
          {renderAuthActions()}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-md border border-neutral-300 p-2 md:hidden"
        >
          <FiMenu />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-700 md:hidden">
          {ROUTES.map((route) => (
            <Link key={route.href} href={route.href} onClick={handleRouteClick}>
              {route.label}
            </Link>
          ))}
          {renderAuthActions('mobile')}
        </div>
      )}
    </header>
  );
}
