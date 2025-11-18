import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useToast } from '../state/ToastContext.jsx';

export default function Completed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast() || { push: () => {} };

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/me/done');
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const undo = async (id) => {
    await api.delete(`/posts/${id}/done`);
    push({ type: 'success', title: 'Undone', desc: 'Item returned to your feed.' });
    load();
  };

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="mt-3 h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-3">
      {items.length === 0 ? (
        <div className="card p-6 text-sm opacity-80">Nothing marked done yet.</div>
      ) : null}
      {items.map((p) => (
        <div key={p._id} className="card p-4 flex items-center justify-between gap-4">
          <a href={p.url} target="_blank" rel="noreferrer" className="flex-1 text-sm text-indigo-600 dark:text-indigo-400 underline break-all hover:opacity-90">{p.url}</a>
          <button className="btn btn-primary text-sm" onClick={() => undo(p._id)}>Undo</button>
        </div>
      ))}
    </div>
  );
}

