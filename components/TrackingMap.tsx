'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from '@iconify/react'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icons in Leaflet + Vite/React
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface TrackingMapProps {
    className?: string
    currentLocation?: string
    originAddress?: string
    destinationAddress?: string
    location?: {
        lat: number
        lng: number
    }
    status?: string
}

export default function TrackingMap({
    className,
    currentLocation,
    originAddress,
    destinationAddress,
    location,
    status
}: TrackingMapProps) {
    // Default center (London) if no location provided
    const defaultCenter: [number, number] = [51.505, -0.09]
    const center: [number, number] = location ? [location.lat, location.lng] : defaultCenter

    const mapPlaceholder = (
        <div className={`bg-bgSurface rounded-sm border border-borderColor overflow-hidden ${className}`}>
            <div className="h-full flex flex-col">
                <div className="bg-neutral-900 text-white px-4 py-3 flex items-center gap-2 border-b border-white/5">
                    <Icon icon="solar:map-point-linear" width="16" className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Tracking</span>
                    {status && (
                        <span className="ml-auto text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">
                            {status}
                        </span>
                    )}
                </div>
                <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-center justify-center p-8 border border-dashed border-borderColor rounded-sm bg-bgMain/50">
                        <div className="text-center">
                            <Icon icon="solar:map-linear" width="48" className="text-textMuted mx-auto mb-2 opacity-50" />
                            <p className="text-xs text-textMuted font-medium">Initializing Map...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Using a key on MapContainer forces re-render when center changes
    // This is a common pattern for Leaflet in React
    const mapKey = `${center[0]}-${center[1]}`

    return (
        <div className={`rounded-sm overflow-hidden border border-borderColor bg-bgSurface ${className}`} style={{ minHeight: '400px' }}>
            <MapContainer
                key={mapKey}
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                        <div className="text-xs font-bold">
                            <p className="text-red-600 uppercase mb-1">{status || 'Shipment Location'}</p>
                            <p className="text-slate-800">{currentLocation || 'Updating...'}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

