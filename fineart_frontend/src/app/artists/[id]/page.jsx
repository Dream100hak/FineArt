import { notFound } from 'next/navigation';
import Link from 'next/link';

const artistMap = {
  'artist-1': {
    name: '하정우',
    discipline: 'Mixed media',
    statement:
      '빛과 그림자가 만들어내는 다층적인 서사를 설치와 영상으로 펼쳐내며 도시의 시간을 재구성합니다.',
    exhibitions: ['White Cube Seoul', 'Frieze Seoul 2025'],
  },
  'artist-2': {
    name: '김하연',
    discipline: 'Digital painting',
    statement: '3D 도면과 유화를 결합해 새로운 질감을 실험합니다.',
    exhibitions: ['FineArt Lab', 'Gwangju Biennale'],
  },
  'artist-3': {
    name: 'Lena Cho',
    discipline: 'Photography',
    statement: '시간의 층위를 장노출 기법으로 축적하여 낯선 풍경을 만듭니다.',
    exhibitions: ['Photo London', 'Paris Photo'],
  },
};

export default function ArtistDetailPage({ params }) {
  const artist = artistMap[params.id];

  if (!artist) {
    notFound();
  }

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Link href="/artists" className="text-sm text-primary">
        ← 작가 목록
      </Link>
      <article className="rounded-3xl border border-neutral-100 bg-white px-6 py-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">{artist.discipline}</p>
        <h1 className="mt-3 text-4xl font-semibold">{artist.name}</h1>
        <p className="mt-4 text-neutral-600">{artist.statement}</p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-neutral-500">Exhibitions</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">
            {artist.exhibitions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
