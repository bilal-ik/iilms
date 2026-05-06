import { Link } from 'react-router-dom';

export default function EmailVerified() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass p-12 rounded-2xl text-center max-w-md w-full"
        style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#065F46' }}>Email Verified!</h1>
        <p className="mb-6" style={{ color: '#374151' }}>
          Your email has been successfully verified. You can now log in to your IILMS account.
        </p>
        <Link to="/login"
          className="px-8 py-3 rounded-xl text-white font-semibold inline-block"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}
