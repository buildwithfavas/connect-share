import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function MobileDrawer({ open, onClose }) {
  const { user, signOut } = useAuth();
  if (!open) return null;
  const displayName = user?.displayName || (user?.email ? String(user.email).split('@')[0] : 'User');
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="md:hidden fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute top-0 bottom-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <Avatar name={displayName} src={user?.photoURL || ''} size={40} />
          <div className="flex flex-col">
            <div className="text-white text-sm font-semibold">{displayName}</div>
            <div className="text-[11px] text-white/60 truncate max-w-[180px]">{user?.email}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <Link to="/feed" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-zinc-800/80">Active Feed</Link>
          <Link to="/submit" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-zinc-800/80">Share a Post</Link>
          <Link to="/myposts" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-zinc-800/80">My Posts</Link>
          <Link to="/completed" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-zinc-800/80">Completed</Link>
          <Link to="/profile" onClick={onClose} className="px-3 py-2 rounded-md hover:bg-zinc-800/80">Profile</Link>
        </nav>
        <div className="mt-auto pt-3 border-t border-zinc-800">
          <button onClick={() => { onClose?.(); signOut(); }} className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-800/80">Log Out</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
