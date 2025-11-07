import Link from 'next/link';

const sections = [
  {
    title: 'Articles',
    description: '인터뷰, 트렌드, 전시 리뷰 등 FineArt 큐레이터의 인사이트를 확인하세요.',
    href: '/articles',
  },
  {
    title: 'Artists',
    description: '신진부터 거장까지 국내외 작가들의 포트폴리오와 프로필을 탐색하세요.',
    href: '/artists',
  },
  {
    title: 'Artworks',
    description: '작품 상세, 재료, 소장처 정보까지 한 번에 모아보세요.',
    href: '/artworks',
  },
];

export default function Home() {
  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-16">
      <section className="section space-y-6 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">FineArt Digital Studio</p>
        <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
          예술가와 컬렉터를 잇는
          <br />프론트엔드 경험을 디자인합니다.
        </h1>
        <p className="text-lg text-neutral-600 md:max-w-3xl">
          Next.js App Router 기반의 SSR 구조로 게시글, 작가, 작품 데이터를 빠르게 불러오고 Tailwind CSS v4로 반응형 UI
          시스템을 구성했습니다.
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

      <section className="section grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-3xl border border-neutral-200 bg-white px-6 py-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase text-primary">Explore</p>
            <h2 className="mt-4 text-2xl font-semibold text-neutral-900">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{section.description}</p>
          </Link>
        ))}
      </section>

      <section className="section space-y-4 rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-white to-amber-50 px-6 py-10 text-center md:px-12">
        <h2 className="text-3xl font-semibold text-neutral-900">FineArt Admin</h2>
        <p className="text-neutral-600">
          관리자는 전시, 작가, 작품 정보를 한 번에 관리하고 프론트에 즉시 반영할 수 있습니다.
        </p>
        <Link href="/admin" className="inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white">
          관리자 대시보드
        </Link>
      </section>
    </div>
  );
}
