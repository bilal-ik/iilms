export default function Pagination({ page, onPrev, onNext, hasMore }) {
  return (
    <div className="flex items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
      >
        ← Previous
      </button>
      <span className="text-sm text-slate-400">Page {page}</span>
      <button
        onClick={onNext}
        disabled={!hasMore}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
      >
        Next →
      </button>
    </div>
  );
}
