'use client';

import Link from 'next/link';
import { formatKoreanDate } from '@/lib/date';

export default function ListBoard({ board, articles }) {
  const slug = board?.slug ?? '';
  return (
    <div className="divide-y divide-neutral-200 rounded-3xl border border-neutral-100 bg-white">
      {articles.map((article) => (
        <div
          key={article.id}
          className="flex flex-col gap-2 px-5 py-4 transition hover:bg-neutral-50"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="uppercase tracking-[0.3em]">{article.category || '카테고리'}</span>
            <span>{formatKoreanDate(article.createdAt)}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href={`/boards/${slug}/${article.id}`}
                className="text-lg font-semibold text-neutral-900 hover:text-neutral-600"
              >
                {article.title}
              </Link>
              <p className="text-sm text-neutral-600 line-clamp-2">{article.excerpt}</p>
            </div>
            <div className="min-w-[80px] text-right text-xs text-neutral-500">
              <p>조회 {article.views?.toLocaleString?.() ?? article.views}</p>
              <p className="mt-1 text-neutral-400">{article.writer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
