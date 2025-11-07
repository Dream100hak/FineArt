const artworks = [
  {
    id: 'artwork-1',
    title: 'Light Fragment 07',
    artist: '김하연',
    year: 2025,
    medium: 'Oil on aluminum',
  },
  {
    id: 'artwork-2',
    title: 'Forest Diagram',
    artist: 'Lena Cho',
    year: 2024,
    medium: 'Pigment print',
  },
  {
    id: 'artwork-3',
    title: 'City Pulse',
    artist: '하정우',
    year: 2023,
    medium: 'LED installation',
  },
];

export default function ArtworksPage() {
  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Collection</p>
        <h1 className="text-4xl font-semibold">작품 데이터</h1>
        <p className="text-neutral-600">소장 정보를 기반으로 작품의 재료와 연도, 작가 정보를 정리합니다.</p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {artworks.map((artwork) => (
          <article key={artwork.id} className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase text-neutral-400">{artwork.artist}</p>
            <h2 className="mt-3 text-2xl font-semibold">{artwork.title}</h2>
            <p className="mt-2 text-sm text-neutral-500">
              {artwork.medium} · {artwork.year}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
