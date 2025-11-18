import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useToast } from '../state/ToastContext.jsx';

export default function Feed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { push } = useToast() || { push: () => {} };
  const [visited, setVisited] = useState(() => {
    try {
      const raw = localStorage.getItem('visitedPostIds');
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  });
  const [engage, setEngage] = useState(() => {
    // Map of postId -> { liked: boolean, commented: boolean }
    return new Map();
  });

  const saveVisited = (nextSet) => {
    try {
      localStorage.setItem('visitedPostIds', JSON.stringify(Array.from(nextSet)));
    } catch {}
  };

  const getEngageKey = (id) => `engage_${id}`;
  const readEngage = (id) => {
    const key = getEngageKey(id);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { liked: false, commented: false };
      const obj = JSON.parse(raw);
      return { liked: !!obj.liked, commented: !!obj.commented };
    } catch {
      return { liked: false, commented: false };
    }
  };
  const writeEngage = (id, value) => {
    try { localStorage.setItem(getEngageKey(id), JSON.stringify(value)); } catch {}
  };
  const setEngageFor = (id, updater) => {
    setEngage((prev) => {
      const next = new Map(prev);
      const current = next.get(id) ?? readEngage(id);
      const updated = typeof updater === 'function' ? updater(current) : updater;
      next.set(id, updated);
      writeEngage(id, updated);
      return next;
    });
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      setItems(res.data || []);
    } catch (e) {
      const err = e?.response?.data?.error || 'Failed to load feed';
      setError(err);
      push({ type: 'error', title: 'Load failed', desc: err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markDone = async (id) => {
    try {
      await api.post(`/posts/${id}/done`);
      setItems((prev) => prev.filter((p) => p._id !== id));
      push({ type: 'success', title: 'Marked done', desc: 'Item removed from your feed.' });
      // Clean up visited state for this id
      setVisited((prev) => {
        const next = new Set(prev);
        next.delete(id);
        saveVisited(next);
        return next;
      });
      // Clean up engagement checklist
      try { localStorage.removeItem(getEngageKey(id)); } catch {}
      setEngage((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    } catch (e) {}
  };

  const markVisited = (id) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveVisited(next);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="mt-3 h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }
  if (error) return <div className="p-4"><div className="card p-4 text-rose-600 dark:text-rose-400">{error}</div></div>;

  return (
    <div className="p-4 space-y-3">
      <div className="card p-3 text-xs opacity-80">
        Please like and comment on each LinkedIn post before marking it as done.
      </div>
      {items.length === 0 ? (
        <div className="card p-6 text-sm opacity-80">No items right now. Submit a LinkedIn post URL to get started.</div>
      ) : null}
      {items
        .slice()
        .sort((a, b) => {
          const av = visited.has(a._id) ? 1 : 0;
          const bv = visited.has(b._id) ? 1 : 0;
          return av - bv; // unvisited first
        })
        .map((p) => {
          const isVisited = visited.has(p._id);
          const eng = engage.get(p._id) ?? readEngage(p._id);
          const canDone = !!(eng.liked && eng.commented);
          return (
            <div
              key={p._id}
              className={`card p-4 flex flex-col gap-3 ${isVisited ? 'opacity-80' : ''}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    {isVisited ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">Visited</span>
                    ) : null}
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => markVisited(p._id)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 underline break-all hover:opacity-90"
                    >
                      {p.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => markVisited(p._id)}
                    className="btn btn-ghost text-sm"
                  >
                    Open
                  </a>
                  <button className="btn btn-primary text-sm" disabled={!canDone} onClick={() => markDone(p._id)}>Mark done</button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!eng.liked}
                    onChange={(e) => setEngageFor(p._id, (cur) => ({ ...cur, liked: e.target.checked }))}
                  />
                  <span>Liked</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!eng.commented}
                    onChange={(e) => setEngageFor(p._id, (cur) => ({ ...cur, commented: e.target.checked }))}
                  />
                  <span>Commented</span>
                </label>
              </div>
            </div>
          );
        })}
    </div>
  );
}

