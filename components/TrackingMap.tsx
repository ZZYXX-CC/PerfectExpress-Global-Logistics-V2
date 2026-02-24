'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon } from '@iconify/react'
import L from 'leaflet'
import { useEffect, useState } from 'react'

const TILE_URLS = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
}

function useTheme(): 'dark' | 'light' {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark'
    })

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light'
            setTheme(current || 'dark')
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
        return () => observer.disconnect()
    }, [])

    return theme
}

function ResizeMap() {
    const map = useMap()
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize()
        }, 500)
        return () => clearTimeout(timer)
    }, [map])
    return null
}

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
    const theme = useTheme()
    const defaultCenter: [number, number] = [51.505, -0.09]
    const center: [number, number] = location ? [location.lat, location.lng] : defaultCenter

    const mapKey = `${center[0]}-${center[1]}-${theme}`

    // Custom pulsing marker icon
    const pulsingIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="map-marker-container"><div class="map-pulse"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    })

    return (
        <div className={`rounded-sm overflow-hidden border border-borderColor bg-bgSurface ${className}`} style={{ height: '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                key={mapKey}
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                className="z-0"
            >
                <ResizeMap />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={TILE_URLS[theme]}
                />
                <Marker position={center} icon={pulsingIcon}>
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

