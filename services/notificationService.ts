import { supabase } from './supabase';
import { emailService } from './emailService';

export interface Notification {
    id: string;
    user_id: string;
    type: 'shipment_update' | 'ticket_reply' | 'system';
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    async fetchNotifications() {
        const impersonatedId = localStorage.getItem('impersonated_user_id');
        const { data: { user } } = await supabase.auth.getUser();
        const activeUserId = impersonatedId || user?.id;

        if (!activeUserId) return { data: [], error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', activeUserId)
            .order('created_at', { ascending: false })
            .limit(50);

        return { data: data as Notification[], error };
    },

    async markAsRead(id: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        return { error };
    },

    async markAllAsRead() {
        const impersonatedId = localStorage.getItem('impersonated_user_id');
        const { data: { user } } = await supabase.auth.getUser();
        const activeUserId = impersonatedId || user?.id;

        if (!activeUserId) return { error: 'Not authenticated' };

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', activeUserId)
            .eq('is_read', false);
        return { error };
    },

    async createNotification(notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>) {
        const { data, error } = await supabase
            .from('notifications')
            .insert([notification])
            .select()
            .single();
        return { data: data as Notification, error };
    },

    async notifyAdmins(title: string, message: string, link?: string) {
        const { data: admins } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .eq('role', 'admin');

        if (!admins) return;

        for (const admin of admins) {
            await this.createNotification({
                user_id: admin.id,
                type: 'system',
                title,
                message,
                link
            });

            // Trigger Email (Conceptual log in dev)
            await emailService.sendEmail({
                to: admin.email,
                ...emailService.templates.adminNewShipmentAlert(link?.split('/').pop() || 'N/A', 'A Customer')
            });
        }
    },

    async sendNewShipmentNotifications(shipment: any) {
        // 1. Notify User (In-App)
        await this.createNotification({
            user_id: shipment.user_id,
            type: 'shipment_update',
            title: 'Shipment Registered',
            message: `Your shipment ${shipment.tracking_number} has been successfully created.`,
            link: `/track/${shipment.tracking_number}`
        });

        // 2. Notify User (Email)
        const { data: userProfile } = await supabase.from('profiles').select('email, full_name').eq('id', shipment.user_id).single();
        if (userProfile) {
            await emailService.sendEmail({
                to: userProfile.email,
                ...emailService.templates.shipmentConfirmation(shipment.tracking_number, userProfile.full_name)
            });
        }

        // 3. Notify Admins
        await this.notifyAdmins(
            'New Shipment Alert',
            `A new shipment (${shipment.tracking_number}) has been submitted. Check details.`,
            `/dashboard?tab=shipments`
        );
    }
};
