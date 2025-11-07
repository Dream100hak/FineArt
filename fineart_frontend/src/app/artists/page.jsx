const artists = [
  {
    id: 'artist-1',
    name: '하정우',
    discipline: 'Mixed media',
    bio: '빛과 그림자를 해체하는 설치 작업으로 알려진 서울 기반 아티스트',
  },
  {
    id: 'artist-2',
    name: '김하연',
    discipline: 'Digital painting',
    bio: '3D 소프트웨어와 칠화를 결합해 새로운 재료감을 구축합니다.',
  },
  {
    id: 'artist-3',
    name: 'Lena Cho',
    discipline: 'Photography',
    bio: '시간의 공기를 기록하는 장노출 기법으로 국제 아트페어에서 주목받았습니다.',
  },
];

export default function ArtistsPage() {
  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Artists</p>
        <h1 className="text-4xl font-semibold">작가 아카이브</h1>
        <p className="text-neutral-600">FineArt에서 활동하는 작가들의 포트폴리오를 한눈에 살펴보세요.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {artists.map((artist) => (
          <article key={artist.id} className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase text-neutral-400">{artist.discipline}</p>
            <h2 className="mt-2 text-2xl font-semibold">{artist.name}</h2>
            <p className="mt-3 text-sm text-neutral-600">{artist.bio}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
