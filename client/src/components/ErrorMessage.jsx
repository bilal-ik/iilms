export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl px-4 py-3 mb-4 text-sm"
      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
      ⚠️ {message}
    </div>
  );
}
