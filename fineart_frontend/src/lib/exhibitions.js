const CATEGORY_VALUES = ['solo', 'group', 'digital', 'installation'];
export const EXHIBITION_CATEGORY_VALUE_SET = new Set(CATEGORY_VALUES);

export const EXHIBITION_CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'solo', label: '솔로' },
  { value: 'group', label: '그룹' },
  { value: 'digital', label: '디지털' },
  { value: 'installation', label: '설치' },
];

const CATEGORY_LABEL_MAP = new Map(
  EXHIBITION_CATEGORIES.filter(({ value }) => value).map(({ value, label }) => [value, label]),
);

export const getExhibitionCategoryLabel = (value) =>
  (value ? CATEGORY_LABEL_MAP.get(value) : null) ?? value ?? '기타';

const FALLBACK_SOURCE = [
  {
    id: 'void-ink',
    title: 'Void Ink · 여백의 잔상',
    description:
      'FineArt Cube를 가득 채운 딥블랙 잉크 조명 설치. 공간의 그림자와 디지털 프로젝션이 교차하는 몰입형 경험을 제공합니다.',
    artist: '이수현',
    startDate: '2025-02-15T09:00:00+09:00',
    endDate: '2025-06-16T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Cube',
    category: 'digital',
    createdAt: '2024-12-20T08:00:00+09:00',
  },
  {
    id: 'seoul-lightscape',
    title: 'Seoul Lightscape',
    description:
      '미나 허의 미디어 회화전. OLED 페인트 패널과 투명 스크린을 활용해 서울의 야경을 재해석합니다.',
    artist: '미나 허',
    startDate: '2025-04-12T09:00:00+09:00',
    endDate: '2025-08-30T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Cube',
    category: 'group',
    createdAt: '2025-01-05T08:00:00+09:00',
  },
  {
    id: 'warm-mineral',
    title: 'Warm Mineral',
    description:
      '라텍스 듀오의 조명 작업전. 섬세한 석고 텍스처와 광섬유를 결합해 따뜻한 무드를 제공합니다.',
    artist: '라텍스 듀오',
    startDate: '2025-05-02T09:00:00+09:00',
    endDate: '2025-09-01T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1465311440653-ba9b1d68da21?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Gallery',
    category: 'installation',
    createdAt: '2025-01-22T08:00:00+09:00',
  },
  {
    id: 'luminary-garden',
    title: 'Luminary Garden',
    description:
      '관람자의 움직임에 반응해 빛나는 인터랙티브 식물 설치. 은은한 향과 사운드가 어우러집니다.',
    artist: '서이현',
    startDate: '2025-03-10T09:00:00+09:00',
    endDate: '2025-07-08T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Green Room',
    category: 'solo',
    createdAt: '2025-01-28T08:00:00+09:00',
  },
  {
    id: 'chromatic-drift',
    title: 'Chromatic Drift',
    description: '8K 색면 미디어가 수평선처럼 이동하며 시간의 흐름을 시각화하는 전시.',
    artist: 'Collective Prism',
    startDate: '2025-06-01T09:00:00+09:00',
    endDate: '2025-10-04T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Cube',
    category: 'group',
    createdAt: '2025-02-03T08:00:00+09:00',
  },
  {
    id: 'echoes-of-clay',
    title: 'Echoes of Clay',
    description: '도자기 조각 위 프로젝션 매핑으로 울리는 색과 소리의 향연.',
    artist: '이마루 & 윤채',
    startDate: '2025-04-05T09:00:00+09:00',
    endDate: '2025-09-19T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Atelier',
    category: 'group',
    createdAt: '2025-02-12T08:00:00+09:00',
  },
  {
    id: 'hologram-opera',
    title: 'Hologram Opera',
    description: '270도 홀로그램 연출과 라이브 클래식 사운드의 몰입형 경험.',
    artist: 'Studio Nabile',
    startDate: '2025-08-15T09:00:00+09:00',
    endDate: '2026-01-12T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Dome',
    category: 'digital',
    createdAt: '2025-03-08T08:00:00+09:00',
  },
  {
    id: 'northbound-light',
    title: 'Northbound Light',
    description: '극지방 빛의 변화를 기록한 사진과 사운드 아카이브를 재현합니다.',
    artist: '린다 베르그',
    startDate: '2025-09-20T09:00:00+09:00',
    endDate: '2026-02-20T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Vault',
    category: 'solo',
    createdAt: '2025-04-01T08:00:00+09:00',
  },
  {
    id: 'paper-tectonics',
    title: 'Paper Tectonics',
    description: '거대한 종이 구조물을 쌓아 도시를 재구성하는 설치 프로젝트.',
    artist: 'Paper Assembly',
    startDate: '2025-05-18T09:00:00+09:00',
    endDate: '2025-11-30T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Warehouse',
    category: 'installation',
    createdAt: '2025-04-10T08:00:00+09:00',
  },
  {
    id: 'sensorial-bloom',
    title: 'Sensorial Bloom',
    description: '향과 빛, 사운드를 결합해 계절의 변화를 체험하는 몰입형 정원.',
    artist: 'Co.studio Bloom',
    startDate: '2025-07-02T09:00:00+09:00',
    endDate: '2025-12-05T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Pavilion',
    category: 'installation',
    createdAt: '2025-04-18T08:00:00+09:00',
  },
  {
    id: 'afterimage-waves',
    title: 'Afterimage Waves',
    description: '레이저 스캔 데이터로 도시의 잔상을 시각화한 디지털 조각.',
    artist: '장도현',
    startDate: '2025-10-08T09:00:00+09:00',
    endDate: '2026-03-14T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Research Lab',
    category: 'digital',
    createdAt: '2025-05-06T08:00:00+09:00',
  },
  {
    id: 'kinetic-archive',
    title: 'Kinetic Archive',
    description: '로봇 암이 수장고 모듈을 재배열하는 라이브 퍼포먼스.',
    artist: 'FineArt Robot Lab',
    startDate: '2025-11-12T09:00:00+09:00',
    endDate: '2026-04-25T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1475688621402-4257a8543cfe?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Machine Room',
    category: 'group',
    createdAt: '2025-05-20T08:00:00+09:00',
  },
  {
    id: 'mist-city-atlas',
    title: 'Mist City Atlas',
    description: '안개 분사 구조와 프로젝션을 합쳐 도시 기후를 표현하는 설치.',
    artist: 'Atmos Lab',
    startDate: '2025-06-25T09:00:00+09:00',
    endDate: '2025-09-30T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Plaza',
    category: 'installation',
    createdAt: '2025-05-28T08:00:00+09:00',
  },
  {
    id: 'aquifer-chorus',
    title: 'Aquifer Chorus',
    description: '수중 녹음과 빛의 파동으로 만드는 사운드 퍼포먼스.',
    artist: 'Mira Collective',
    startDate: '2025-12-01T09:00:00+09:00',
    endDate: '2026-05-10T19:00:00+09:00',
    imageUrl: 'https://images.unsplash.com/photo-1475694867812-f82b8696d610?auto=format&fit=crop&w=2000&q=80',
    location: 'FineArt Hall B1',
    category: 'digital',
    createdAt: '2025-06-08T08:00:00+09:00',
  },
];

const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80';

const toIsoString = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const coerceCategory = (value) => {
  if (!value) return '';
  const normalized = String(value).trim().toLowerCase();
  return EXHIBITION_CATEGORY_VALUE_SET.has(normalized) ? normalized : '';
};

export function normalizeExhibition(item, index = 0) {
  if (!item) return null;

  const category = coerceCategory(item.category ?? item.Category);

  return {
    id:
      item.id ??
      item.Id ??
      item.slug ??
      item.Slug ??
      item.exhibitionId ??
      `exhibition-${index}`,
    title: item.title ?? item.Title ?? '제목 미정',
    description:
      item.description ??
      item.Description ??
      item.synopsis ??
      '세부 정보가 준비 중입니다.',
    artist: item.artist ?? item.Artist ?? 'FineArt Curator',
    startDate: toIsoString(item.startDate ?? item.StartDate),
    endDate: toIsoString(item.endDate ?? item.EndDate),
    imageUrl:
      item.imageUrl ?? item.ImageUrl ?? item.thumbnailUrl ?? item.coverUrl ?? DEFAULT_IMAGE,
    location: item.location ?? item.Location ?? 'FineArt Space',
    category,
    createdAt: toIsoString(item.createdAt ?? item.CreatedAt) ?? new Date().toISOString(),
  };
}

export const FALLBACK_EXHIBITIONS = FALLBACK_SOURCE.map((item, index) =>
  normalizeExhibition(item, index),
);

export function normalizeExhibitionsFromPayload(payload) {
  const collection = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];

  return collection.map(normalizeExhibition).filter(Boolean);
}

export function formatExhibitionPeriod(startDate, endDate, location) {
  const start = startDate ? DISPLAY_DATE_FORMATTER.format(new Date(startDate)) : null;
  const end = endDate ? DISPLAY_DATE_FORMATTER.format(new Date(endDate)) : null;

  let range = '';
  if (start && end) {
    range = `${start} – ${end}`;
  } else if (start) {
    range = `${start} – ongoing`;
  } else if (end) {
    range = `Now – ${end}`;
  } else {
    range = '상설 전시';
  }

  if (location) {
    range = `${range} · ${location}`;
  }

  return range;
}

export function filterExhibitionsByQuery(exhibitions, { category, keyword }) {
  const normalizedCategory = coerceCategory(category);
  const normalizedKeyword = (keyword ?? '').trim().toLowerCase();

  return exhibitions.filter((exhibition) => {
    const matchesCategory = !normalizedCategory || exhibition.category === normalizedCategory;
    if (!normalizedKeyword) {
      return matchesCategory;
    }

    const haystack = [
      exhibition.title,
      exhibition.artist,
      exhibition.location,
      exhibition.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return matchesCategory && haystack.includes(normalizedKeyword);
  });
}

const toHeroSlide = (exhibition) => ({
  id: exhibition.id,
  title: exhibition.title,
  period: formatExhibitionPeriod(exhibition.startDate, exhibition.endDate, exhibition.location),
  synopsis: exhibition.description,
  image: exhibition.imageUrl,
  objectPosition: 'center center',
  info: [
    exhibition.artist ? `Artist · ${exhibition.artist}` : null,
    exhibition.location ? `Location · ${exhibition.location}` : null,
    exhibition.category ? `Category · ${getExhibitionCategoryLabel(exhibition.category)}` : null,
  ].filter(Boolean),
  cta: { href: `/exhibitions/${exhibition.id}`, label: '상세 보기' },
});

export function buildHeroSlides(exhibitions) {
  const source = exhibitions?.length ? exhibitions : FALLBACK_EXHIBITIONS;
  return source.slice(0, 3).map(toHeroSlide);
}

export function findFallbackExhibition(id) {
  if (!id) return null;
  return FALLBACK_EXHIBITIONS.find(
    (exhibition) => String(exhibition.id).toLowerCase() === String(id).toLowerCase(),
  );
}
