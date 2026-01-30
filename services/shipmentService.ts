import { supabase } from './supabase';
import { notificationService } from './notificationService';

export interface ShipmentData {
    sender_info: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
    receiver_info: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
    parcel_details: {
        description: string;
        weight: string;
        quantity: string;
        type: string;
    };
}

export const generateTrackingNumber = () => {
    return `PX-${Math.floor(10000000 + Math.random() * 90000000)}`;
};

export const createShipment = async (data: ShipmentData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to create a shipment' };

    const trackingNumber = generateTrackingNumber();

    // Extract city from address or fallback
    const cityMatch = data.sender_info.address.match(/[a-zA-Z\u00C0-\u00FF\s]+(?=,|$)/);
    const originCity = cityMatch ? cityMatch[0].trim() : 'Central';
    const initialLocation = `${originCity} Logistics Center`;

    // Default initial status
    const initialStatus = 'pending';

    const { data: shipment, error } = await supabase
        .from('shipments')
        .insert({
            user_id: user.id,
            tracking_number: trackingNumber,
            sender_info: data.sender_info,
            receiver_info: data.receiver_info,
            parcel_details: data.parcel_details,
            status: initialStatus,
            payment_status: 'unpaid',
            current_location: initialLocation,
            history: [
                {
                    status: initialStatus,
                    location: initialLocation,
                    note: 'Shipment created and processing at origin facility.',
                    timestamp: new Date().toISOString()
                }
            ]
        })
        .select()
        .single();

    // Trigger Notifications
    await notificationService.sendNewShipmentNotifications(shipment);

    return { success: true, trackingNumber: shipment.tracking_number };
};
