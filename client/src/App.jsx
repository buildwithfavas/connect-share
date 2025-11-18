import { Routes, Route, Navigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from './state/AuthContext.jsx';
import SignIn from './pages/SignIn.jsx';
import Feed from './pages/Feed.jsx';
import Submit from './pages/Submit.jsx';
import Completed from './pages/Completed.jsx';
import Connect from './pages/Connect.jsx';
import Friends from './pages/Friends.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const body = document.body;
    const isDark = root.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', nextTheme);
  };
  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 rounded-md border text-sm hover:bg-indigo-50 dark:hover:bg-zinc-800"
      title="Toggle theme"
      aria-label="Toggle color theme"
    >
      <span className="hidden sm:inline">Theme</span><span className="sm:hidden">🌓</span>
    </button>
  );
}

function Nav() {
  const { user, signOut } = useAuth();
  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-900/70 bg-white/80 dark:bg-zinc-900/80 border-b">
      <div className="px-4 py-3 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold text-indigo-600 dark:text-indigo-400">Bro To Link</Link>
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <NavLink to="/" end className={({ isActive }) => `text-sm px-2 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-zinc-800'}`}>Feed</NavLink>
              <NavLink to="/submit" className={({ isActive }) => `text-sm px-2 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-zinc-800'}`}>Submit</NavLink>
              <NavLink to="/completed" className={({ isActive }) => `text-sm px-2 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-zinc-800'}`}>Completed</NavLink>
              <NavLink to="/connect" className={({ isActive }) => `text-sm px-2 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-zinc-800'}`}>Connect</NavLink>
              <NavLink to="/friends" className={({ isActive }) => `text-sm px-2 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-zinc-800'}`}>Friends</NavLink>

              <span className="mx-2 h-5 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden="true"></span>
              <span className="text-[11px] uppercase tracking-wide opacity-60 select-none">Coming soon</span>

              <span className="text-sm px-2 py-1 rounded-md opacity-50 cursor-not-allowed border border-transparent" title="Coming soon" aria-disabled>
                Chat
              </span>
              <span className="text-sm px-2 py-1 rounded-md opacity-50 cursor-not-allowed border border-transparent" title="Coming soon" aria-disabled>
                Twitter Connect
              </span>
              <span className="text-sm px-2 py-1 rounded-md opacity-50 cursor-not-allowed border border-transparent" title="Coming soon" aria-disabled>
                Discussions
              </span>
              <span className="text-sm px-2 py-1 rounded-md opacity-50 cursor-not-allowed border border-transparent" title="Coming soon" aria-disabled>
                AI Tools
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <button className="text-sm px-3 py-1.5 border rounded-md hover:bg-indigo-50 dark:hover:bg-zinc-800" onClick={signOut}>Sign out</button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Protected><Feed /></Protected>} />
          <Route path="/submit" element={<Protected><Submit /></Protected>} />
          <Route path="/completed" element={<Protected><Completed /></Protected>} />
          <Route path="/connect" element={<Protected><Connect /></Protected>} />
          <Route path="/friends" element={<Protected><Friends /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t">
        <div className="px-4 py-6 text-sm flex items-center justify-center gap-2">
          <span className="opacity-70">Developed by</span>
          <a
            href="https://www.linkedin.com/in/favasmaruthil/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
            title="Open LinkedIn profile"
          >
            <span className="font-medium">Mohammed Favas</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
