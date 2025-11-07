import Link from 'next/link';
import { getArticles } from '@/lib/api';

const fallbackArticles = [
  {
    id: 'preview-1',
    title: '디지털 페인팅이 만든 새로운 컬렉션 문화',
    summary: 'AI와 실시간 렌더링이 결합된 전시가 어떻게 관람 경험을 바꾸는지 살펴봅니다.',
    author: 'FineArt Editorial',
    publishedAt: '2025-11-05',
  },
  {
    id: 'preview-2',
    title: '서울 갤러리 위크, 놓치지 말아야 할 전시 5',
    summary: '국내 주요 큐레이터들이 추천하는 11월 전시 리스트를 정리했습니다.',
    author: 'Lee ARA',
    publishedAt: '2025-11-02',
  },
  {
    id: 'preview-3',
    title: '작가 노트: 신진 아티스트 김하연의 빛 실험',
    summary: '건축 도면에서 시작된 빛과 그림자의 탐험 과정을 인터뷰했습니다.',
    author: 'FineArt Lab',
    publishedAt: '2025-10-28',
  },
];

async function loadArticles() {
  try {
    const articles = await getArticles();
    return { articles, isFallback: false };
  } catch (error) {
    console.error('[Articles] Failed to fetch from API:', error);
    return { articles: fallbackArticles, isFallback: true };
  }
}

export const revalidate = 0; // SSR

export default async function ArticlesPage() {
  const { articles, isFallback } = await loadArticles();

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Stories & Insights</p>
        <h1 className="text-4xl font-semibold text-neutral-900">FineArt Articles</h1>
        <p className="text-neutral-600">
          작가 인터뷰, 전시 리뷰, 컬렉터 인사이트를 하나의 아카이브로 제공합니다.
        </p>
        {isFallback && (
          <p className="text-xs text-amber-600">
            API 응답을 기다리는 동안 샘플 데이터를 보여주고 있어요. 백엔드가 준비되면 자동으로 대체됩니다.
          </p>
        )}
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col gap-4 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-widest text-neutral-400">{article.author}</p>
            <h2 className="text-2xl font-semibold text-neutral-900">{article.title}</h2>
            <p className="text-sm text-neutral-600">{article.summary}</p>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{article.publishedAt}</span>
              <Link href={`/articles/${article.id}`} className="text-primary">
                자세히 보기 →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
