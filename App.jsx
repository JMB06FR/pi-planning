/*
PI Planning PWA — Single-file React App (App.jsx)

How to use:
1) Create a Vite React app (recommended) or use Create React App.
   npx create-vite@latest pi-planning --template react
   cd pi-planning
2) Install Tailwind (optional) or use the included CSS variables.
3) Replace src/App.jsx with this file. Ensure Tailwind is configured if you keep Tailwind classes.
4) Add a simple manifest.json and service-worker to enable PWA features (example below in comments).

This single-file app includes:
- Home screen
- Rooms list
- Teams list
- Map view (interactive SVG) with tappable pins
- Room detail modal / page
- Simple client-side data store (data embedded, can be replaced with fetch to /api/data.json)
- "Add to home screen" friendly meta

Notes: The UI uses Tailwind utility classes. If you don't want Tailwind, replace className with your own CSS.

PWA manifest example (public/manifest.json):
{
  "name": "PI Planning Rooms",
  "short_name": "PI Rooms",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {"src":"/icons/icon-192.png","sizes":"192x192","type":"image/png"},
    {"src":"/icons/icon-512.png","sizes":"512x512","type":"image/png"}
  ]
}

Service Worker (basic) hint: use Workbox or simple service worker to cache / offline.

Now the React code starts below:
*/

import React, { useState, useMemo, useEffect } from 'react';

// Sample data (replace with fetch('/data.json') for dynamic data)
const SAMPLE_DATA = {
  rooms: [
    { id: 'R1', name: 'Breakout Room Alpha', capacity: 12, location: '2nd Floor - Left Wing', x: 20, y: 22, teamId: 'T1' },
    { id: 'R2', name: 'Breakout Room Beta', capacity: 10, location: '1st Floor - Right Wing', x: 48, y: 30, teamId: 'T2' },
    { id: 'R3', name: 'Breakout Room Gamma', capacity: 8, location: '3rd Floor - Center', x: 60, y: 60, teamId: 'T3' },
    { id: 'R4', name: 'Breakout Room Delta', capacity: 14, location: '2nd Floor - Right Wing', x: 28, y: 70, teamId: 'T4' }
  ],
  teams: [
    { id: 'T1', name: 'Team Jupiter', productOwner: 'Sarah', scrumMaster: 'Liam', roomId: 'R1' },
    { id: 'T2', name: 'Team Neptune', productOwner: 'Ana', scrumMaster: 'Mohamed', roomId: 'R2' },
    { id: 'T3', name: 'Team Mars', productOwner: 'Priya', scrumMaster: 'Chen', roomId: 'R3' },
    { id: 'T4', name: 'Team Venus', productOwner: 'Ola', scrumMaster: 'Tom', roomId: 'R4' }
  ]
};

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

export default function App() {
  const [data, setData] = useState(SAMPLE_DATA);
  const [route, setRoute] = useState({ name: 'home' }); // {name: 'rooms'} {name:'room', id: 'R1'} {name:'map'} {name:'teams'}
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    // placeholder: if you serve data.json from the server, fetch it here
    // fetch('/data.json').then(r=>r.json()).then(setData)
  }, []);

  const rooms = useMemo(() => data.rooms.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || (r.location || '').toLowerCase().includes(query.toLowerCase())), [data.rooms, query]);
  const teams = useMemo(() => data.teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase())), [data.teams, query]);

  function openRoom(id) {
    setRoute({ name: 'room', id });
  }
  function openTeams() { setRoute({ name: 'teams' }); }
  function openRooms() { setRoute({ name: 'rooms' }); }
  function openMap() { setRoute({ name: 'map' }); }

  const currentRoom = useMemo(() => data.rooms.find(r => r.id === route.id), [data.rooms, route]);
  const currentTeam = useMemo(() => data.teams.find(t => t.id === (currentRoom?.teamId || route.id)), [data.teams, currentRoom, route]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-md mx-auto p-4">
        <TopNav title={route.name === 'home' ? 'PI Planning' : route.name === 'map' ? 'Map' : route.name === 'rooms' ? 'Rooms' : route.name === 'teams' ? 'Teams' : (currentRoom?.name || 'Room')} onBack={() => setRoute({ name: 'home' })} showBack={route.name !== 'home'} onOpenMenu={() => setShowMenu(s => !s)} />

        <div className="mt-4">
          {route.name === 'home' && (
            <HomeScreen onRooms={openRooms} onTeams={openTeams} onMap={openMap} />
          )}

          {route.name === 'rooms' && (
            <div>
              <SearchBar value={query} onChange={setQuery} placeholder="Search rooms or locations..." />
              <List>
                {rooms.map(room => (
                  <RoomCard key={room.id} room={room} team={data.teams.find(t => t.id === room.teamId)} onClick={() => openRoom(room.id)} />
                ))}
              </List>
            </div>
          )}

          {route.name === 'teams' && (
            <div>
              <SearchBar value={query} onChange={setQuery} placeholder="Search teams..." />
              <List>
                {teams.map(team => (
                  <TeamCard key={team.id} team={team} room={data.rooms.find(r => r.id === team.roomId)} onClick={() => openRoom(team.roomId)} />
                ))}
              </List>
            </div>
          )}

          {route.name === 'room' && currentRoom && (
            <div>
              <RoomDetail room={currentRoom} team={data.teams.find(t => t.id === currentRoom.teamId)} />
            </div>
          )}

          {route.name === 'map' && (
            <div>
              <MapView rooms={data.rooms} onPinClick={(id) => openRoom(id)} containerSize={size} />
            </div>
          )}

        </div>

        <footer className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-3 flex justify-between">
            <button className="flex-1 mr-2 p-3 bg-blue-600 text-white rounded-lg" onClick={openRooms}>Rooms</button>
            <button className="flex-1 mx-2 p-3 bg-blue-600 text-white rounded-lg" onClick={openTeams}>Teams</button>
            <button className="flex-1 ml-2 p-3 bg-blue-600 text-white rounded-lg" onClick={openMap}>Map</button>
          </div>
        </footer>

      </div>
    </div>
  );
}

function TopNav({ title, showBack, onBack, onOpenMenu }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {showBack ? (
          <button aria-label="Back" onClick={onBack} className="p-2 rounded-lg mr-2">◀</button>
        ) : null}
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div>
        <button onClick={onOpenMenu} className="p-2 rounded-lg">☰</button>
      </div>
    </div>
  );
}

function HomeScreen({ onRooms, onTeams, onMap }) {
  return (
    <div className="space-y-6 pt-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">PI Planning</h2>
        <p className="text-sm text-gray-600 mt-2">2-day event — find breakout rooms and teams quickly</p>
      </div>
      <div className="space-y-4">
        <button onClick={onRooms} className="w-full py-5 rounded-xl bg-blue-600 text-white text-lg font-semibold">Rooms</button>
        <button onClick={onTeams} className="w-full py-5 rounded-xl bg-blue-600 text-white text-lg font-semibold">Teams</button>
        <button onClick={onMap} className="w-full py-5 rounded-xl bg-blue-600 text-white text-lg font-semibold">Map</button>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <input className="w-full p-3 rounded-lg border border-gray-200" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function List({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function RoomCard({ room, team, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-sm text-gray-600">{team?.name || 'Unassigned'}</p>
          <p className="text-sm text-gray-500 mt-1">{room.location}</p>
        </div>
        <div className="text-sm text-gray-500">Cap: {room.capacity}</div>
      </div>
    </div>
  );
}

function TeamCard({ team, room, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-600">PO: {team.productOwner} • SM: {team.scrumMaster}</p>
          <p className="text-sm text-gray-500 mt-1">{room?.name || 'Room not assigned'}</p>
        </div>
      </div>
    </div>
  );
}

function RoomDetail({ room, team }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-2xl font-bold">{room.name}</h2>
      <p className="text-sm text-gray-600 mt-2">Team: {team?.name || 'Unassigned'}</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Capacity</div>
          <div className="text-lg font-semibold">{room.capacity}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Location</div>
          <div className="text-lg font-semibold">{room.location}</div>
        </div>
      </div>
      <div className="mt-4">
        <button className="w-full py-3 rounded-lg bg-blue-600 text-white">Open Map Location</button>
      </div>
    </div>
  );
}

function MapView({ rooms, onPinClick, containerSize }) {
  // Interactive SVG map scaled to container width
  const width = Math.min(540, containerSize.width - 32);
  const height = Math.round(width * 1.6);

  return (
    <div className="bg-white p-3 rounded-xl shadow">
      <div className="text-sm text-gray-500 mb-2">Tap a pin to open room details</div>
      <div style={{ width }} className="mx-auto border border-gray-100 rounded-lg overflow-hidden">
        <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: height }}>
          {/* Simple floor layout boxes */}
          <rect x="2" y="2" width="96" height="156" rx="3" fill="#f9fafb" stroke="#e6e6e6" />
          <rect x="6" y="8" width="44" height="48" fill="#fff" stroke="#e2e8f0" />
          <rect x="52" y="8" width="42" height="32" fill="#fff" stroke="#e2e8f0" />
          <rect x="6" y="60" width="40" height="36" fill="#fff" stroke="#e2e8f0" />
          <rect x="50" y="60" width="44" height="40" fill="#fff" stroke="#e2e8f0" />
          <rect x="10" y="104" width="38" height="46" fill="#fff" stroke="#e2e8f0" />

          {/* Pins */}
          {rooms.map(room => (
            <g key={room.id} transform={`translate(${room.x}, ${room.y})`} style={{ cursor: 'pointer' }} onClick={() => onPinClick(room.id)}>
              <path d="M0,-4 C2,-4 4,-2 4,0 C4,3 0,8 0,8 C0,8 -4,3 -4,0 C-4,-2 -2,-4 0,-4 Z" fill="#1e40af" />
              <text x="6" y="2" fontSize="5" fill="#fff" fontWeight="600">{room.name.split(' ').slice(-1)[0]}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/*
To enable offline and PWA behaviour:
- Add the manifest.json shown above to public/manifest.json
- Add link in index.html: <link rel="manifest" href="/manifest.json">
- Register a service worker (src/sw.js) and register it from index.js

Example service worker (very small):
self.addEventListener('install', event => {
  event.waitUntil(caches.open('pi-planning-v1').then(cache => cache.addAll(['/','/index.html','/styles.css','/data.json'])));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});

Hosting: Deploy to Vercel, Netlify, or GitHub Pages. For QR code, generate one pointing to your hosted URL and print/put it by the doors.

Optional next steps I can do for you (pick any):
- Convert this to a full Vite project and give you a zip
- Provide the manifest.json + service worker + index.html files
- Replace sample data with a Firebase / Supabase integration and auth
- Generate a QR code and short link for distribution
*/
