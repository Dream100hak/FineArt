import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById } from '@/lib/api';

const SERVER_OFFLINE_MESSAGE = '서버 점검 중입니다. 잠시 후 다시 시도해주세요.';

const fallbackMap = new Map([
  [
    'preview-1',
    {
      id: 'preview-1',
      title: 'AI 컬렉터가 바꾸는 디지털 미술 경험',
      content:
        '몰입형 스크린과 생성형 렌더링이 결합한 새로운 전시 환경에서는 큐레이션의 기준 자체가 달라집니다. FineArt Lab이 시뮬레이션한 컬렉션 룸과 데이터 기반 큐레이션 툴을 소개합니다.',
      writer: 'FineArt Editorial',
      category: '공지',
      createdAt: '2025-11-05T00:00:00Z',
    },
  ],
  [
    'preview-2',
    {
      id: 'preview-2',
      title: '서울 갤러리 위크, 놓치지 말아야 할 전시 5',
      content:
        '11월 첫째 주에 열리는 주요 전시를 동선별로 정리했습니다. 북촌-익선-한남 순환 코스를 통해 하루 만에 다섯 개의 신작 전시를 둘러볼 수 있습니다.',
      writer: 'Lee ARA',
      category: '정보',
      createdAt: '2025-11-02T00:00:00Z',
    },
  ],
  [
    'preview-3',
    {
      id: 'preview-3',
      title: '빛을 조립하는 작가, 김서연 인터뷰',
      content:
        '건축 설계를 전공한 김서연 작가는 빛의 궤적을 데이터로 기록해 다시 공간에 투사합니다. FineArt Residency에서 준비 중인 신작을 미리 만나보세요.',
      writer: 'FineArt Lab',
      category: '뉴스',
      createdAt: '2025-10-28T00:00:00Z',
    },
  ],
]);

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return value;
  }
};

async function loadArticle(id) {
  try {
    const article = await getArticleById(id);
    return { article, isFallback: false };
  } catch (error) {
    console.error('[Article] Failed to fetch from API:', error);
    return { article: fallbackMap.get(id), isFallback: true };
  }
}

export default async function ArticleDetailPage({ params }) {
  const { article, isFallback } = await loadArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Link href="/articles" className="text-sm text-primary">
        ← 목록으로
      </Link>

      {isFallback && (
        <p className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">{SERVER_OFFLINE_MESSAGE}</p>
      )}

      <article className="space-y-6 rounded-3xl border border-neutral-100 bg-white px-6 py-10 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-neutral-400">
            <span>{article.category ?? 'ARTICLE'}</span>
            <span className="text-neutral-300">•</span>
            <span>{article.writer ?? 'FineArt'}</span>
          </div>
          <h1 className="text-4xl font-semibold text-neutral-900">{article.title}</h1>
          <p className="text-sm text-neutral-500">{formatDate(article.createdAt)}</p>
        </div>

        <p className="text-base leading-7 text-neutral-700 whitespace-pre-line">{article.content}</p>

        {typeof article.views === 'number' && (
          <p className="text-xs text-neutral-400">조회수 {article.views.toLocaleString('ko-KR')}</p>
        )}
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return Array.from(fallbackMap.keys()).map((id) => ({ id }));
}
