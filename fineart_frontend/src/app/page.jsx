import Link from 'next/link';

const sections = [
  {
    title: 'Articles',
    description: '칼럼과 리뷰, 인터뷰 등 FineArt 스튜디오의 이야기를 살펴보세요.',
    href: '/articles',
    accent: 'bg-orange-500',
  },
  {
    title: 'Artists',
    description: '신진 작가부터 거장까지 다양한 포트폴리오를 탐색해 보세요.',
    href: '/artists',
    accent: 'bg-lime-500',
  },
  {
    title: 'Artworks',
    description: '작품 상세, 재료, 전시 이력을 한눈에 확인할 수 있습니다.',
    href: '/artworks',
    accent: 'bg-emerald-500',
  },
];

export default function Home() {
  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-16">
      <section className="section space-y-6 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">FineArt Digital Studio</p>
        <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
          예술가와 컬렉터를 잇는
          <br />새로운 온라인 경험을 제안합니다.
        </h1>
        <p className="text-lg text-neutral-600 md:max-w-3xl">
          Next.js App Router와 Tailwind CSS 기반으로 기사, 전시, 작품 데이터를 빠르게 제공합니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <Link href="/articles" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
            최신 아티클 보기
          </Link>
          <Link href="/login" className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary">
            큐레이터 로그인
          </Link>
        </div>
      </section>

      <section className="section space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">작가 · 작품 · 매거진</p>
        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-center justify-between rounded-[32px] border border-neutral-200 bg-white px-5 py-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Explore</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-900">{section.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{section.description}</p>
              </div>
              <span className={`hidden h-3 w-3 rounded-full md:inline-block ${section.accent}`} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section space-y-4 rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-white to-amber-50 px-6 py-10 text-center md:px-12">
        <h2 className="text-3xl font-semibold text-neutral-900">FineArt Admin</h2>
        <p className="text-neutral-600">
          관리자 전용 도구에서 전시, 기사, 작품 정보를 통합 관리하고 즉시 반영할 수 있습니다.
        </p>
        <Link href="/admin" className="inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white">
          관리자 콘솔 이동
        </Link>
      </section>
    </div>
  );
}
