import { useState } from 'react';
import api from '../utils/api.js';
import { useToast } from '../state/ToastContext.jsx';

export default function Submit() {
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState('');
  const { push } = useToast() || { push: () => {} };

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/posts', { url });
      setMsg('Submitted!');
      push({ type: 'success', title: 'Submitted', desc: 'Your post was added to the shared feed.' });
      setUrl('');
    } catch (e) {
      const err = e?.response?.data?.error || 'Failed. Make sure it is a valid LinkedIn URL.';
      setMsg(err);
      push({ type: 'error', title: 'Submit failed', desc: err });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="card p-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Submit a LinkedIn post</h1>
          <p className="text-sm opacity-80">Paste a public LinkedIn post URL. Teammates will open, like, and comment, then mark done.</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium">LinkedIn Post URL</label>
          <input
            className="input"
            placeholder="https://www.linkedin.com/posts/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-ghost" onClick={() => setUrl('')}>Clear</button>
          </div>
          {msg && <div className="text-sm opacity-80">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
