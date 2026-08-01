// Minimal inline SVG icon set (stroke-based, lucide-inspired) so the site
// has zero external icon dependency. Usage in EJS: <%- icon('file-user') %>

const paths = {
  "file-user":
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="12" cy="14.5" r="2"/><path d="M9 19c.5-1.5 1.8-2.5 3-2.5s2.5 1 3 2.5"/>',
  "id-card":
    '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h6M14 14h4"/><path d="M6 16.5c.5-1.2 1.5-2 2-2s1.5.8 2 2"/>',
  "file-check":
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
  passport:
    '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="9" r="2.5"/><path d="M8 15.5c.7-1.5 2-2.4 4-2.4s3.3.9 4 2.4"/><path d="M8 19h8"/>',
  "file-plus":
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 12v6M9 15h6"/>',
  monitor:
    '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  printer:
    '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 17v4h12v-4"/>',
  camera:
    '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  "file-text":
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6M9 9h1"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13 1 .36 1.98.68 2.92a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.16-1.24a2 2 0 0 1 2.11-.45c.94.32 1.92.55 2.92.68A2 2 0 0 1 22 16.92z"/>',
  mail:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
  "map-pin":
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  whatsapp:
    '<path d="M17.6 6.4A8.9 8.9 0 0 0 4.6 17.7L3 21l3.4-1.6A8.9 8.9 0 1 0 17.6 6.4z"/><path d="M8.5 8.7c.1-.5.6-.5.9-.5.3 0 .5 0 .7.5.2.4.6 1.4.7 1.5.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.3.3-.4.4-.1.1-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.3 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.5-.1 1.1-.5 1.5-.4.5-1.5.9-2.6.7-1-.2-3-1-4.7-2.6-1.5-1.5-2.2-3-2.5-3.9-.2-.9-.1-1.6.1-1.9z"/>',
  facebook:
    '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.1L18 10h-4V7a1 1 0 0 1 1-1h3z"/>',
  briefcase:
    '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/><circle cx="18" cy="9" r="2.5"/><path d="M22 21v-1a4 4 0 0 0-3-3.9"/>',
  layers:
    '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.9-1L3 20l1.1-4.2A8.4 8.4 0 1 1 21 11.5z"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.6.7 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/>',
  grid: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.4 5h13.2L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
};

function icon(name, cls) {
  const d = paths[name] || paths["file-text"];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${cls || ""}">${d}</svg>`;
}

function iconList() {
  return Object.keys(paths);
}

module.exports = { icon, iconList };
