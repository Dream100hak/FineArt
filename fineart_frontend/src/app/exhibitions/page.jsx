import Link from 'next/link';
import HeroCarousel from '@/components/exhibitions/HeroCarousel';
import ExhibitionFilters from '@/components/exhibitions/ExhibitionFilters';
import ExhibitionPagination from '@/components/exhibitions/ExhibitionPagination';
import { getExhibitions } from '@/lib/api';
import {
  buildHeroSlides,
  EXHIBITION_CATEGORIES,
  EXHIBITION_CATEGORY_VALUE_SET,
  FALLBACK_EXHIBITIONS,
  filterExhibitionsByQuery,
  formatExhibitionPeriod,
  getExhibitionCategoryLabel,
  normalizeExhibitionsFromPayload,
} from '@/lib/exhibitions';

export const revalidate = 0;

const parsePositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const formatDateLabel = (value) => {
  if (!value) return '미정';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '미정' : date.toLocaleDateString('ko-KR');
};

export default async function ExhibitionsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const rawCategory = (resolvedParams?.category ?? '').toString().toLowerCase();
  const category = EXHIBITION_CATEGORY_VALUE_SET.has(rawCategory) ? rawCategory : '';
  const keyword = (resolvedParams?.keyword ?? '').toString();
  const page = parsePositiveNumber(resolvedParams?.page, 1);
  const size = parsePositiveNumber(resolvedParams?.size, 9);

  let payload = null;
  let fetchError = null;

  try {
    payload = await getExhibitions({
      category: category || undefined,
      keyword: keyword || undefined,
      search: keyword || undefined,
      page,
      size,
    });
  } catch (error) {
    console.error('[Exhibitions] Failed to fetch exhibitions:', error);
    fetchError = error;
  }

  const normalizedApi = normalizeExhibitionsFromPayload(payload);
  const isFallback = Boolean(fetchError);

  let visibleExhibitions = normalizedApi;
  let total = payload?.total ?? normalizedApi.length;
  let currentPage = payload?.page ?? page;
  let currentSize = payload?.size ?? size;

  if (isFallback) {
    const filteredFallback = filterExhibitionsByQuery(FALLBACK_EXHIBITIONS, {
      category,
      keyword,
    });
    total = filteredFallback.length;
    currentPage = page;
    currentSize = size;
    const start = (page - 1) * size;
    visibleExhibitions = filteredFallback.slice(start, start + size);
  }

  const heroSlides = buildHeroSlides(isFallback ? FALLBACK_EXHIBITIONS : normalizedApi);
  const hasResults = visibleExhibitions.length > 0;

  return (
    <>
      <HeroCarousel slides={heroSlides} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">FineArt Exhibition</p>
          <h1 className="text-5xl font-semibold text-neutral-900">전시 일정</h1>
          {fetchError && (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-700">
              API 호출에 실패해 시드 데이터를 표시합니다.
            </p>
          )}
        </header>

        <ExhibitionFilters
          categories={EXHIBITION_CATEGORIES}
          activeCategory={category}
          initialKeyword={keyword}
        />

        <section>
          <header className="mb-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Category</p>
              <h2 className="text-3xl font-semibold text-neutral-900">
                {category ? getExhibitionCategoryLabel(category) : '전체'}
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              총 {total}건 · 페이지 {currentPage}
            </p>
          </header>

          {hasResults ? (
            <>
              <div className="grid gap-8 lg:gap-10 md:grid-cols-2">
                {visibleExhibitions.map((exhibition) => {
                  const badgeLabel = exhibition.category
                    ? getExhibitionCategoryLabel(exhibition.category)
                    : '기타';
                  const period = formatExhibitionPeriod(
                    exhibition.startDate,
                    exhibition.endDate,
                    exhibition.location,
                  );

                  return (
                    <article key={exhibition.id} className="space-y-4">
                      <div className="group relative h-[360px] w-full overflow-hidden rounded-[48px] border border-neutral-200 shadow-lg shadow-black/10 md:h-[440px]">
                        <img
                          src={exhibition.imageUrl}
                          alt={exhibition.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-7 pb-7 text-white">
                          <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">
                              {period}
                            </p>
                            <h3 className="text-3xl font-semibold leading-tight md:text-[34px]">
                              {exhibition.title}
                            </h3>
                          </div>
                          <span className="rounded-full border border-white/40 px-4 py-1 text-xs uppercase tracking-[0.3em] whitespace-nowrap">
                            {badgeLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-3 text-sm text-neutral-600 md:flex-row md:items-center">
                        <div>
                          <p className="font-medium text-neutral-900">{exhibition.artist}</p>
                          <p>{exhibition.location}</p>
                        </div>
                        <div className="text-neutral-500">
                          <p>시작 · {formatDateLabel(exhibition.startDate)}</p>
                          <p>종료 · {formatDateLabel(exhibition.endDate)}</p>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600">{exhibition.description}</p>
                      <Link
                        href={`/exhibitions/${exhibition.id}`}
                        className="inline-flex text-sm font-semibold text-neutral-900 underline-offset-8 hover:underline"
                      >
                        상세 보기
                      </Link>
                    </article>
                  );
                })}
              </div>
              <div className="pt-8">
                <ExhibitionPagination page={currentPage} size={currentSize} total={total} />
              </div>
            </>
          ) : (
            <div className="rounded-[32px] border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
              조건에 맞는 전시가 없습니다. 다른 검색어나 카테고리를 시도해 주세요.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
