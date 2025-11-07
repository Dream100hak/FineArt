import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById } from '@/lib/api';

const fallbackMap = new Map([
  [
    'preview-1',
    {
      title: '디지털 페인팅이 만든 새로운 컬렉션 문화',
      body: '몰입형 디스플레이와 실시간 렌더링이 결합된 디지털 페인팅은 컬렉터에게 완전히 다른 소장 경험을 제공합니다...',
      author: 'FineArt Editorial',
      publishedAt: '2025-11-05',
      tags: ['Tech', 'Digital Art'],
    },
  ],
  [
    'preview-2',
    {
      title: '서울 갤러리 위크, 놓치지 말아야 할 전시 5',
      body: '11월 첫째 주 서울 곳곳에서 열리는 전시를 테마별로 선별했습니다...',
      author: 'Lee ARA',
      publishedAt: '2025-11-02',
      tags: ['Seoul', 'Guide'],
    },
  ],
  [
    'preview-3',
    {
      title: '작가 노트: 신진 아티스트 김하연의 빛 실험',
      body: '건축 도면에서 출발한 작가는 빛을 구조화된 레이어로 기록합니다...',
      author: 'FineArt Lab',
      publishedAt: '2025-10-28',
      tags: ['Interview'],
    },
  ],
]);

async function loadArticle(id) {
  try {
    const article = await getArticleById(id);
    return article;
  } catch (error) {
    console.error('[Article] Failed to fetch from API:', error);
    return fallbackMap.get(id);
  }
}

export default async function ArticleDetailPage({ params }) {
  const article = await loadArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Link href="/articles" className="text-sm text-primary">
        ← 목록으로
      </Link>
      <article className="space-y-6 rounded-3xl border border-neutral-100 bg-white px-6 py-10 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">{article.author}</p>
          <h1 className="text-4xl font-semibold text-neutral-900">{article.title}</h1>
          <p className="text-sm text-neutral-500">{article.publishedAt}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
          {article.tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-neutral-200 px-3 py-1">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-base leading-7 text-neutral-700">{article.body}</p>
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return Array.from(fallbackMap.keys()).map((id) => ({ id }));
}
