export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl px-4 py-3 mb-4 text-sm font-medium"
      style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626' }}>
      ⚠️ {message}
    </div>
  );
}
