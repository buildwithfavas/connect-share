import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import api from '../utils/api.js';

export default function SignIn() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="p-6 border rounded max-w-sm w-full space-y-4">
        <h1 className="text-xl font-semibold text-center">Sign in</h1>
        <div className="space-y-2">
          <label className="block text-sm">Full name</label>
          <input
            className="input w-full"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">LinkedIn profile URL</label>
          <input
            className="input w-full"
            placeholder="https://www.linkedin.com/in/username"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
          <p className="text-xs opacity-70">This URL will be visible to other users to help connect.</p>
        </div>
        {error ? (
          <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div>
        ) : null}
        <button
          className="btn btn-primary w-full"
          disabled={saving}
          onClick={async () => {
            setError('');
            const nm = name.trim();
            const url = linkedinUrl.trim();
            if (!nm) { setError('Full name is required'); return; }
            if (!url) { setError('LinkedIn URL is required'); return; }
            // Basic client validation; server will validate strictly
            try {
              const u = new URL(url);
              if (u.protocol !== 'https:' || !u.hostname.toLowerCase().endsWith('linkedin.com')) {
                setError('Enter a valid https://linkedin.com URL');
                return;
              }
            } catch {
              setError('Enter a valid LinkedIn URL');
              return;
            }
            try {
              setSaving(true);
              await signIn();
              await api.post('/me/profile', { name: nm, linkedinUrl: url });
              navigate('/', { replace: true });
            } catch (e) {
              const msg = e?.response?.data?.error || 'Sign-in failed';
              setError(msg);
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? 'Signing in…' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}
