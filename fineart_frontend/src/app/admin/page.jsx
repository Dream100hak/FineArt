const sections = [
  {
    title: 'Articles',
    description: '신규 아티클 작성, 승인 상태 관리, 노출 우선순위를 조정합니다.',
  },
  {
    title: 'Artists',
    description: '작가 프로필, 연락처, 대표 작품을 업데이트합니다.',
  },
  {
    title: 'Artworks',
    description: '작품 이미지, 재료, 전시 이력을 관리합니다.',
  },
];

export default function AdminPage() {
  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Admin Console</p>
        <h1 className="text-4xl font-semibold">관리자 대시보드</h1>
        <p className="text-neutral-600">
          콘텐츠 팀이 게시글, 작가, 작품 데이터를 운영 환경에 배포하기 전에 검수할 수 있는 공간입니다.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase text-neutral-400">Manage</p>
            <h2 className="mt-3 text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm text-neutral-600">{section.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
