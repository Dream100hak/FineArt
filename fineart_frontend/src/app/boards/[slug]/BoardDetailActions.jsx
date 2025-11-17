'use client';

import Link from 'next/link';
import useDecodedAuth from '@/hooks/useDecodedAuth';

export default function BoardDetailActions({ boardSlug, articleId }) {
  const { decodedRole } = useDecodedAuth();
  const isAdmin = decodedRole === 'admin';

  if (!isAdmin || !boardSlug || !articleId) {
    return null;
  }

  return (
    <Link
      href={`/boards/${boardSlug}/write?articleId=${articleId}`}
      className="rounded-full border border-neutral-300 px-4 py-1 font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
    >
      글 수정
    </Link>
  );
}
