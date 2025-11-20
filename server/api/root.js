export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end('Method Not Allowed');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  return res.end(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mind Merge API</title>
        <style>
          body{background:#0b0b0f;color:#e5e7eb;font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;display:grid;place-items:center;height:100vh;margin:0}
          .card{border:1px solid #27272a;border-radius:12px;padding:24px;max-width:640px}
          a{color:#818cf8;text-decoration:none}
          code{background:#111827;padding:2px 6px;border-radius:6px}
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Mind Merge API</h1>
          <p>Server is running. Use the <code>/api</code> endpoints from the client.</p>
          <ul>
            <li>Health: <a href="/api/health">/api/health</a></li>
            <li>Me: <code>/api/me</code></li>
            <li>Posts: <code>/api/posts</code></li>
            <li>Admin: <code>/api/admin/*</code> (requires admin token)</li>
          </ul>
        </div>
      </body>
    </html>`);
}
