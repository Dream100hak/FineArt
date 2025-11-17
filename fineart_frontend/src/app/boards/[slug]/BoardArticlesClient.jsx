'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiFileText, FiGrid, FiLayers, FiSearch } from 'react-icons/fi';
import useDecodedAuth from '@/hooks/useDecodedAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getBoardArticles } from '@/lib/api';

const CATEGORY_FILTERS = [
  { label: '전체', value: '' },
  { label: '공지', value: 'notice' },
  { label: '뉴스', value: 'news' },
  { label: '전시/행사', value: 'event' },
  { label: '채용', value: 'recruit' },
  { label: '커뮤니티', value: 'community' },
];

const normalizeArticle = (article, index) => {
  if (!article) return null;
  const boardInfo = article.board ?? article.Board ?? {};
  const content = article.content ?? '';
  return {
    id: article.id ?? article.Id ?? `article-${index}`,
    title: article.title ?? '제목 미정',
    content,
    excerpt: article.excerpt ?? content.slice(0, 160),
    writer: article.author ?? article.writer ?? 'FineArt',
    category: article.category ?? '',
    createdAt: article.createdAt ?? article.UpdatedAt ?? new Date().toISOString(),
    views: article.views ?? 0,
    boardSlug: boardInfo.slug ?? article.boardSlug ?? boardInfo?.Slug ?? '',
  };
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function BoardArticlesClient({ board, initialData }) {
  const { decodedRole, isAuthenticated } = useDecodedAuth();
  const isAdmin = decodedRole === 'admin';
  const canWrite = isAuthenticated && !initialData?.isFallback;

  const [currentBoard, setCurrentBoard] = useState(initialData.board ?? board);
  const [articles, setArticles] = useState(
    (initialData.items ?? []).map(normalizeArticle).filter(Boolean),
  );
  const [meta, setMeta] = useState({
    page: initialData.page ?? 1,
    size: initialData.size ?? 12,
    total: initialData.total ?? initialData.items?.length ?? 0,
  });
  const [category, setCategory] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [viewMode, setViewMode] = useState(
    (currentBoard?.layoutType ?? 'card').toLowerCase() === 'table' ? 'table' : 'cards',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialData.error ?? null);
  const [isFallback, setIsFallback] = useState(initialData.isFallback ?? false);

  const searchDebounceRef = useRef(null);
  const keywordRef = useRef(keyword);
  const categoryRef = useRef(category);

  useEffect(() => {
    keywordRef.current = keyword;
  }, [keyword]);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  useEffect(() => {
    setViewMode(
      (currentBoard?.layoutType ?? 'card').toLowerCase() === 'table' ? 'table' : 'cards',
    );
  }, [currentBoard?.layoutType, currentBoard?.slug]);

  const fetchArticles = useCallback(
    async (pageOverride = 1) => {
      setLoading(true);
      setError(null);
      try {
        const payload = await getBoardArticles(board.slug, {
          page: pageOverride,
          size: meta.size,
          category: categoryRef.current || undefined,
          keyword: keywordRef.current || undefined,
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
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      setKeyword(searchValue.trim());
    }, 400);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchValue]);

  useEffect(() => {
    fetchArticles(1);
  }, [category, keyword, fetchArticles]);

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.size));

  const handlePageChange = (direction) => {
    const nextPage =
      direction === 'next' ? Math.min(meta.page + 1, totalPages) : Math.max(meta.page - 1, 1);
    if (nextPage === meta.page) return;
    fetchArticles(nextPage);
  };

  const renderCategoryTabs = () => (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_FILTERS.map((tab) => {
        const isActive = category === tab.value;
        return (
          <button
            key={tab.value || 'all'}
            type="button"
            onClick={() => setCategory(tab.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              isActive
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const renderCards = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {articles.map((article) => (
        <article
          key={article.id}
          className="flex flex-col justify-between rounded-3xl border border-neutral-100 bg-white/90 p-5 shadow-sm"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              {article.category || '카테고리'}
            </p>
            <Link
              href={`/boards/${board.slug}/${article.id}`}
              className="text-2xl font-semibold text-neutral-900 hover:underline"
            >
              {article.title}
            </Link>
            <p className="text-sm text-neutral-600 line-clamp-3">{article.excerpt}</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
            <span>
              {article.writer} · {formatDate(article.createdAt)}
            </span>
            <span>조회 {article.views?.toLocaleString?.() ?? article.views}</span>
          </div>
        </article>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white/90 shadow-sm">
      <table className="min-w-full divide-y divide-neutral-100 text-sm">
        <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3 text-left">제목</th>
            <th className="px-4 py-3 text-left">작성자</th>
            <th className="px-4 py-3 text-left">작성일</th>
            <th className="px-4 py-3 text-right">조회수</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white/80">
          {articles.map((article) => (
            <tr key={article.id}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <Link
                    href={`/boards/${board.slug}/${article.id}`}
                    className="font-semibold text-neutral-900 hover:underline"
                  >
                    {article.title}
                  </Link>
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    {article.category || '기타'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-neutral-600">{article.writer}</td>
              <td className="px-4 py-3 text-neutral-600">{formatDate(article.createdAt)}</td>
              <td className="px-4 py-3 text-right text-neutral-600">
                {article.views?.toLocaleString?.() ?? article.views}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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

    return viewMode === 'table' ? renderTable() : renderCards();
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
                href="/admin/boards"
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {renderCategoryTabs()}
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="검색어를 입력하세요"
                className="w-full rounded-full border border-neutral-200 bg-white px-12 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div className="flex rounded-full border border-neutral-200 bg-white p-1 text-xs font-semibold text-neutral-500">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                  viewMode === 'cards' ? 'bg-neutral-900 text-white' : 'hover:text-neutral-900'
                }`}
              >
                <FiGrid /> 카드
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                  viewMode === 'table' ? 'bg-neutral-900 text-white' : 'hover:text-neutral-900'
                }`}
              >
                <FiLayers /> 테이블
              </button>
            </div>
          </div>
        </div>

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
