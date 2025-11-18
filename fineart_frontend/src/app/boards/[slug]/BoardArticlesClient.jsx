'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import useDecodedAuth from '@/hooks/useDecodedAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getBoardArticles } from '@/lib/api';
import CardBoard from '@/components/boards/CardBoard';
import ListBoard from '@/components/boards/ListBoard';
import GalleryBoard from '@/components/boards/GalleryBoard';
import MediaBoard from '@/components/boards/MediaBoard';
import TimelineBoard from '@/components/boards/TimelineBoard';

const stripHtml = (value = '') =>
  value
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeArticle = (article, index) => {
  if (!article) return null;
  const boardInfo = article.board ?? article.Board ?? {};
  const content = article.content ?? '';
  const excerptSource = article.excerpt ?? content;
  const plainExcerpt = stripHtml(excerptSource)?.slice(0, 160) ?? '';
  return {
    id: article.id ?? article.Id ?? `article-${index}`,
    title: article.title ?? '제목 미정',
    content,
    excerpt: plainExcerpt || '내용을 불러올 수 없습니다.',
    writer: article.author ?? article.writer ?? 'FineArt',
    category: article.category ?? '',
    createdAt: article.createdAt ?? article.UpdatedAt ?? new Date().toISOString(),
    views: article.views ?? 0,
    boardSlug: boardInfo.slug ?? article.boardSlug ?? boardInfo?.Slug ?? '',
    imageUrl: article.imageUrl ?? article.heroImage ?? '',
    thumbnailUrl: article.thumbnailUrl ?? article.thumbUrl ?? '',
  };
};

export default function BoardArticlesClient({ board, initialData }) {
  const { decodedRole, isAuthenticated } = useDecodedAuth();
  const isAdmin = decodedRole === 'admin';
  const canWrite = isAuthenticated && !initialData?.isFallback;

  const normalizedInitialArticles = useMemo(
    () => (initialData.items ?? []).map(normalizeArticle).filter(Boolean),
    [initialData.items],
  );

  const [currentBoard, setCurrentBoard] = useState(initialData.board ?? board);
  const [articles, setArticles] = useState(normalizedInitialArticles);
  const [meta, setMeta] = useState({
    page: initialData.page ?? 1,
    size: initialData.size ?? 12,
    total: initialData.total ?? initialData.items?.length ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialData.error ?? null);
  const [isFallback, setIsFallback] = useState(initialData.isFallback ?? false);
  const fetchArticles = useCallback(
    async (pageOverride = 1) => {
      setLoading(true);
      setError(null);
      try {
        const payload = await getBoardArticles(board.slug, {
          page: pageOverride,
          size: meta.size,
        });

        setArticles((payload?.items ?? []).map(normalizeArticle).filter(Boolean));
        setMeta({
          page: payload?.page ?? pageOverride,
          size: payload?.size ?? meta.size,
          total: payload?.total ?? payload?.items?.length ?? 0,
        });

        if (payload?.board) {
          setCurrentBoard(payload.board);
        }
        setIsFallback(false);
      } catch (err) {
        console.error('[Board] Failed to fetch articles:', err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [board.slug, meta.size],
  );

  useEffect(() => {
    if (initialData?.isFallback) {
      fetchArticles(1);
    }
  }, [initialData?.isFallback, fetchArticles]);

  useEffect(() => {
    setCurrentBoard(initialData.board ?? board);
    setArticles(normalizedInitialArticles);
    setMeta({
      page: initialData.page ?? 1,
      size: initialData.size ?? 12,
      total: initialData.total ?? initialData.items?.length ?? normalizedInitialArticles.length ?? 0,
    });
    setError(initialData.error ?? null);
    setIsFallback(initialData.isFallback ?? false);
  }, [
    board,
    initialData.board,
    initialData.page,
    initialData.size,
    initialData.total,
    initialData.items,
    initialData.error,
    initialData.isFallback,
    normalizedInitialArticles,
  ]);

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.size));

  const handlePageChange = (direction) => {
    const nextPage =
      direction === 'next' ? Math.min(meta.page + 1, totalPages) : Math.max(meta.page - 1, 1);
    if (nextPage === meta.page) return;
    fetchArticles(nextPage);
  };

  const layoutComponents = {
    card: CardBoard,
    cards: CardBoard,
    table: ListBoard,
    list: ListBoard,
    gallery: GalleryBoard,
    media: MediaBoard,
    timeline: TimelineBoard,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <LoadingSpinner label="게시글을 불러오는 중입니다..." />
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-white/80 p-10 text-center text-sm text-neutral-500">
          조건에 맞는 게시글이 없습니다. 다른 검색어나 카테고리를 선택해 주세요.
        </div>
      );
    }

    const normalizedLayout = (currentBoard?.layoutType ?? 'card').toLowerCase();
    const LayoutComponent = layoutComponents[normalizedLayout] ?? CardBoard;
    return (
      <LayoutComponent
        board={currentBoard ?? board}
        articles={articles}
      />
    );
  };

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-8 py-10">
      <header className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              {currentBoard?.slug ?? board.slug ?? 'board'}
            </p>
            <h1 className="text-4xl font-semibold text-neutral-900">
              {currentBoard?.name ?? board.name}
            </h1>
            <p className="mt-2 text-sm text-neutral-600">{currentBoard?.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <p>
              게시글{' '}
              <span className="font-semibold text-neutral-900">
                {meta.total?.toLocaleString() ?? currentBoard?.articleCount ?? 0}
              </span>
            </p>
            {isAdmin && (
              <Link
                href={`/admin/boards?slug=${encodeURIComponent(currentBoard?.slug ?? board.slug ?? '')}`}
                className="rounded-full border border-neutral-200 px-4 py-2 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                게시판 설정
              </Link>
            )}
            {canWrite ? (
              <Link
                href={`/boards/${board.slug}/write`}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 font-semibold text-white transition hover:bg-neutral-800"
              >
                글쓰기
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                로그인 후 글쓰기
              </Link>
            )}
          </div>
        </div>
        {isFallback && (
          <p className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">
            {initialData?.error ?? '백엔드 연결을 확인할 수 없어 샘플 게시글을 표시합니다.'}
          </p>
        )}
        {error && (
          <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
      </header>

      <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm">
        {renderContent()}

        <div className="flex flex-col items-center gap-3 text-sm text-neutral-600 md:flex-row md:justify-between">
          <p>
            {meta.page} / {totalPages} 페이지
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handlePageChange('prev')}
              className="rounded-full border border-neutral-200 px-4 py-2 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-40"
              disabled={meta.page <= 1}
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => handlePageChange('next')}
              className="rounded-full border border-neutral-200 px-4 py-2 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-40"
              disabled={meta.page >= totalPages}
            >
              다음
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white/70 p-6 text-sm text-neutral-600 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-neutral-900">
          <FiFileText /> 게시판 이용 안내
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-neutral-600">
          <li>글 작성 시 닉네임 또는 이메일을 남겨 주세요.</li>
          <li>허위 사실, 저작권 침해, 반복 광고 글은 숨김 처리될 수 있습니다.</li>
          <li>전시/행사 게시판의 콘텐츠는 메인 홍보 영역에 소개될 수 있습니다.</li>
        </ul>
      </section>
    </div>
  );
}
