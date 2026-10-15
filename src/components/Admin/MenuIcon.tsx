import type { MenuIconKey } from '../../lib/tiposAdmin';

// Line icons for the side menu (24px grid, 1.75 stroke).
// Drawn inline so the panel does not pull in an icon library for twelve glyphs.
const STROKES: Record<MenuIconKey, string[]> = {
  attractions: ['M8 3l4 8 5-5 5 15H2L8 3z'],
  lodging: ['M2 4v16', 'M2 8h18a2 2 0 0 1 2 2v10', 'M2 17h20', 'M6 8v9'],
  restaurants: [
    'M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2',
    'M7 2v20',
    'M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7',
  ],
  operators: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
  offices: ['M3 22h18', 'M6 18v-7', 'M10 18v-7', 'M14 18v-7', 'M18 18v-7', 'M12 2l8 5H4l8-5z'],
  rentals: ['M5 17H3v-4.5L5.5 7h11l3.5 5.5V17h-1', 'M9 17h6', 'M7 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'M17 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'],
  events: ['M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  categories: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
  maps: ['M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z', 'M8 2v16', 'M16 6v16'],
  messages: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  export: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  users: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
};

export default function MenuIcon({ name }: { name: MenuIconKey }) {
  return (
    <svg
      className="rt_admin_icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {STROKES[name].map((stroke) => (
        <path key={stroke} d={stroke} />
      ))}
    </svg>
  );
}
