import { getArtists } from '@/lib/api';

const SERVER_OFFLINE_MESSAGE = '서버 점검 중입니다. 잠시 후 다시 시도해주세요.';

const fallbackArtists = [
  {
    id: 'artist-1',
    name: '정다은',
    nationality: 'KOR',
    bio: '빛과 그림자를 입체적으로 엮는 설치 작업으로 서울 기반에서 활동 중인 아티스트입니다.',
    createdAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 'artist-2',
    name: '김서연',
    nationality: 'KOR',
    bio: '3D 소프트웨어와 칠화를 결합해 새로운 질감을 구축하는 디지털 페인팅 작가입니다.',
    createdAt: '2025-10-22T00:00:00Z',
  },
  {
    id: 'artist-3',
    name: 'Lena Cho',
    nationality: 'USA',
    bio: '도시의 공기를 기록하는 아날로그 사진 기법으로 주목받는 포토그래퍼입니다.',
    createdAt: '2025-10-05T00:00:00Z',
  },
];

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('ko-KR');
  } catch (error) {
    return value;
  }
};

async function loadArtists() {
  try {
    const artists = await getArtists();
    return { artists: Array.isArray(artists) ? artists : [], isFallback: false };
  } catch (error) {
    console.error('[Artists] Failed to fetch from API:', error);
    return { artists: fallbackArtists, isFallback: true };
  }
}

export const revalidate = 0;

export default async function ArtistsPage() {
  const { artists, isFallback } = await loadArtists();

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Artists</p>
        <h1 className="text-4xl font-semibold">FineArt 아카이브</h1>
        <p className="text-neutral-600">FineArt와 협업 중인 아티스트들의 스토리를 만나보세요.</p>
        {isFallback && (
          <p className="rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">{SERVER_OFFLINE_MESSAGE}</p>
        )}
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {artists.map((artist) => (
          <article key={artist.id} className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase text-neutral-400">{artist.nationality ?? 'Worldwide'}</p>
            <h2 className="mt-2 text-2xl font-semibold">{artist.name}</h2>
            <p className="mt-3 text-sm text-neutral-600 line-clamp-4">{artist.bio}</p>
            <p className="mt-4 text-xs text-neutral-400">가입일 {formatDate(artist.createdAt)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
