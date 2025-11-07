import Link from 'next/link';
import { getArticles } from '@/lib/api';

const SERVER_OFFLINE_MESSAGE = '서버 점검 중입니다. 잠시 후 다시 시도해주세요.';

const fallbackArticles = [
  {
    id: 'preview-1',
    title: 'AI 컬렉터가 바꾸는 디지털 미술 경험',
    content:
      '몰입형 스크린과 생성형 렌더링이 결합한 새로운 전시 환경에서는 큐레이션의 기준 자체가 달라집니다. FineArt Lab이 시뮬레이션한 컬렉션 룸을 공개합니다.',
    writer: 'FineArt Editorial',
    category: '공지',
    createdAt: '2025-11-05T00:00:00Z',
  },
  {
    id: 'preview-2',
    title: '서울 갤러리 위크, 놓치지 말아야 할 전시 5',
    content:
      '11월 첫째 주, 북촌에서 한남까지 이어지는 5개 갤러리를 연결한 도보 코스를 소개합니다. 동선을 따라가며 작가 인터뷰와 추천 작품을 만나보세요.',
    writer: 'Lee ARA',
    category: '정보',
    createdAt: '2025-11-02T00:00:00Z',
  },
  {
    id: 'preview-3',
    title: '빛을 조립하는 작가, 김서연 인터뷰',
    content:
      '건축 설계에서 출발해 데이터로 빛을 기록하는 김서연 작가의 작업실을 찾았습니다. 최근 FineArt Residency에서 준비 중인 신작에 대해 이야기했습니다.',
    writer: 'FineArt Lab',
    category: '뉴스',
    createdAt: '2025-10-28T00:00:00Z',
  },
];

const normalizeArticles = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('ko-KR');
  } catch (error) {
    return value;
  }
};

const getExcerpt = (content) => {
  if (!content) return '';
  return content.length > 140 ? `${content.slice(0, 140)}…` : content;
};

async function loadArticles() {
  try {
    const payload = await getArticles();
    const articles = normalizeArticles(payload);
    return { articles, isFallback: false };
  } catch (error) {
    console.error('[Articles] Failed to fetch from API:', error);
    return { articles: fallbackArticles, isFallback: true };
  }
}

export const revalidate = 0;

export default async function ArticlesPage() {
  const { articles, isFallback } = await loadArticles();

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Stories & Insights</p>
        <h1 className="text-4xl font-semibold text-neutral-900">FineArt Articles</h1>
        <p className="text-neutral-600">전시 리뷰, 시장 인사이트, 공지까지 통합 게시판에서 확인하세요.</p>
        {isFallback && (
          <p className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">{SERVER_OFFLINE_MESSAGE}</p>
        )}
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col gap-4 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
          >
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="uppercase tracking-widest">{article.writer ?? 'FineArt'}</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">{article.title}</h2>
            <p className="text-sm text-neutral-600">{getExcerpt(article.content)}</p>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="rounded-full border border-neutral-200 px-3 py-1 text-[11px] uppercase tracking-widest">
                {article.category ?? 'Article'}
              </span>
              <Link href={`/articles/${article.id}`} className="text-primary">
                자세히 보기
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
