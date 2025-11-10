export const metadata = {
  title: 'FineArt Sales',
};

export default function SalesPage() {
  return (
    <main className="min-h-[60vh] bg-white text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Sales</p>
        <h1 className="text-4xl font-semibold">FineArt Marketplace</h1>
        <p className="text-neutral-500">
          전시와 연동된 에디션·콜렉터블 스토어가 준비 중입니다. 큐레이션 데이터를 정리한 뒤 곧 공개될 예정이에요.
        </p>
      </div>
    </main>
  );
}
