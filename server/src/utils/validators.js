export function isValidLinkedInUrl(urlString) {
  try {
    const u = new URL(urlString);
    const host = u.hostname.toLowerCase();
    if (!host.endsWith('linkedin.com')) return false;
    if (u.protocol !== 'https:') return false;
    return true;
  } catch (e) {
    return false;
  }
}

export function isValidHttpsUrl(urlString) {
  try {
    const u = new URL(urlString);
    return u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

export function isValidLinkedInProfileUrl(urlString) {
  try {
    const u = new URL(urlString);
    const host = u.hostname.toLowerCase();
    if (!host.endsWith('linkedin.com')) return false;
    if (u.protocol !== 'https:') return false;
    // Normalize path and ensure it matches /in/<handle>(/)?
    const path = u.pathname.replace(/\/+/, '/');
    const parts = path.split('/').filter(Boolean); // remove empty segments
    // Must be at least ['in', '<handle>']
    if (parts.length < 2) return false;
    if (parts[0] !== 'in') return false;
    const handle = parts[1];
    // Basic handle rules: letters, numbers, dash, underscore, dot; at least 1 char
    if (!/^[A-Za-z0-9._-]+$/.test(handle)) return false;
    return true;
  } catch (e) {
    return false;
  }
}
