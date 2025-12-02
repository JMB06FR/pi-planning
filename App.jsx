import React, { useState, useMemo, useEffect } from 'react';
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
