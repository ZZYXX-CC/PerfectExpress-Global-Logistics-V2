'use client'

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { Icon } from '@iconify/react'

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
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

    // Default center (London) if no location provided
    const defaultCenter = { lat: 51.505, lng: -0.09 }
    const center = location || defaultCenter

    // Show a nice placeholder with location info when no API key or if Google Maps fails to load
    if (!apiKey) {
        return (
            <div className={`bg-bgSurface rounded-sm border border-borderColor overflow-hidden ${className}`}>
                <div className="h-full flex flex-col">
                    {/* Map placeholder header */}
                    <div className="bg-neutral-900 text-white px-4 py-3 flex items-center gap-2 border-b border-white/5">
                        <Icon icon="solar:map-point-linear" width="16" className="text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Tracking</span>
                        {status && (
                            <span className="ml-auto text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">
                                {status}
                            </span>
                        )}
                    </div>

                    {/* Location details */}
                    <div className="flex-1 p-6 space-y-4">
                        <div className="flex items-center justify-center p-8 border border-dashed border-borderColor rounded-sm bg-bgMain/50">
                            <div className="text-center">
                                <Icon icon="solar:map-linear" width="48" className="text-textMuted mx-auto mb-2 opacity-50" />
                                <p className="text-xs text-textMuted font-medium">Map view requires API Key</p>
                            </div>
                        </div>

                        {currentLocation && (
                            <div className="flex items-start gap-3 p-3 bg-bgMain rounded-sm border border-borderColor">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="solar:box-linear" width="16" className="text-blue-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest">Current Location</p>
                                    <p className="text-sm font-bold text-textMain truncate">{currentLocation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div className={`rounded-sm overflow-hidden border border-borderColor ${className}`}>
                <Map
                    defaultCenter={defaultCenter}
                    center={center}
                    defaultZoom={10}
                    zoom={12}
                    gestureHandling={'cooperative'}
                    disableDefaultUI={false}
                    zoomControl={true}
                    className="w-full h-full"
                    style={{ minHeight: '400px' }}
                >
                    <Marker position={center} />
                </Map>
            </div>
        </APIProvider>
    )
}
