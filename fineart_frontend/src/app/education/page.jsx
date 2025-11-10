export const metadata = {
  title: 'FineArt Education',
};

export default function EducationPage() {
  return (
    <main className="min-h-[60vh] bg-white text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Education</p>
        <h1 className="text-4xl font-semibold">Learning Programs</h1>
        <p className="text-neutral-500">
          큐레이터 토크, 패밀리 도슨트, 아트테크 워크숍이 순차적으로 오픈됩니다. 세부 일정과 신청 링크는 전시 리뉴얼
          발표와 함께 제공될 예정입니다.
        </p>
      </div>
    </main>
  );
}
