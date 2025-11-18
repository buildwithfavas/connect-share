import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useToast } from '../state/ToastContext.jsx';

export default function Friends() {
  const { push } = useToast() || { push: () => {} };
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  const load = async (opts = {}) => {
    try {
      setLoading(true);
      const qp = new URLSearchParams();
      qp.set('limit', String(limit));
      qp.set('page', String(opts.page ?? page));
      if ((opts.q ?? q).trim()) qp.set('q', (opts.q ?? q).trim());
      const res = await api.get(`/connections/friends?${qp.toString()}`);
      const data = res.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setHasMore(!!data.hasMore);
    } catch (e) {
      push({ type: 'error', title: 'Failed to load friends' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const unfriend = async (userId) => {
    try {
      await api.delete(`/connections/unfriend/${userId}`);
      push({ type: 'success', title: 'Removed from friends' });
      setItems((prev) => prev.filter((u) => u._id !== userId));
    } catch (e) {
      push({ type: 'error', title: 'Failed to unfriend' });
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); load({ q: e.currentTarget.value, page: 1 }); } }}
            placeholder="Search name or email"
            className="input h-9 w-56"
          />
          <button className="btn btn-ghost h-9" onClick={() => { setPage(1); load({ q, page: 1 }); }}>Search</button>
          <button className="btn btn-ghost h-9" onClick={() => { setQ(''); setPage(1); load({ q: '', page: 1 }); }}>Clear</button>
          <button className="btn btn-ghost h-9" onClick={() => load()}>Refresh</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-6 text-sm opacity-80">No friends yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((u) => (
            <div key={u._id} className="card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{u.name || u.email || u._id}</div>
                <div className="text-sm opacity-70 truncate">{u.email}</div>
                {u.linkedinUrl ? (
                  <a
                    href={u.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 underline truncate"
                    title="Open LinkedIn profile"
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
              <button className="btn btn-ghost" onClick={() => unfriend(u._id)}>Unfriend</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          className="btn btn-ghost h-9"
          disabled={page <= 1}
          onClick={() => { const np = Math.max(1, page - 1); setPage(np); load({ page: np }); }}
        >
          Prev
        </button>
        <div className="text-sm opacity-70">Page {page}</div>
        <button
          className="btn btn-ghost h-9"
          disabled={!hasMore}
          onClick={() => { const np = page + 1; setPage(np); load({ page: np }); }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
