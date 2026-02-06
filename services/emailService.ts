export interface EmailPayload {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const emailService = {
    async sendEmail(payload: EmailPayload) {
        // In a real production app, this would call a Supabase Edge Function 
        // that uses the Resend API with a secret key.
        // For development, we log the attempt.
        console.log(`[Email Service] Sending to ${payload.to}: ${payload.subject}`);
        console.log(`[Text Content] ${payload.text}`);

        // Return success for UI feedback
        return { success: true };
    },

    templates: {
        shipmentConfirmation(trackingNumber: string, recipientName: string) {
            return {
                subject: `PerfectExpress | Shipment Registered: ${trackingNumber}`,
                text: `Hello ${recipientName}, your shipment has been registered with tracking number ${trackingNumber}. You can track it on our platform.`,
                html: `<h1>Shipment Registered</h1><p>Hello ${recipientName},</p><p>Your shipment <strong>${trackingNumber}</strong> has been successfully created. View it <a href="/track/${trackingNumber}">here</a>.</p>`
            };
        },
        receiverShipmentNotification(trackingNumber: string, receiverName: string, senderName: string) {
            return {
                subject: `PerfectExpress | Incoming Shipment: ${trackingNumber}`,
                text: `Hello ${receiverName}, ${senderName} has created a shipment to you. Track it with ${trackingNumber}.`,
                html: `<h1>Incoming Shipment</h1><p>Hello ${receiverName},</p><p><strong>${senderName}</strong> has created a shipment to you.</p><p>Tracking: <strong>${trackingNumber}</strong></p><p>Track it <a href="/track/${trackingNumber}">here</a>.</p>`
            };
        },
        adminNewShipmentAlert(trackingNumber: string, userName: string) {
            return {
                subject: `ADMIN ALERT | New Shipment Submission: ${trackingNumber}`,
                text: `User ${userName} has submitted a new shipment for processing. ID: ${trackingNumber}`,
                html: `<h1>New Shipment Submission</h1><p>User <strong>${userName}</strong> has created a new manifest.</p><p>Tracking: <strong>${trackingNumber}</strong></p>`
            };
        },
        statusUpdate(trackingNumber: string, status: string) {
            return {
                subject: `PerfectExpress | Tracking Update: ${trackingNumber}`,
                text: `Your shipment ${trackingNumber} has been updated to: ${status.toUpperCase()}.`,
                html: `<h1>Tracking Update</h1><p>The status of your shipment <strong>${trackingNumber}</strong> has changed to <strong>${status.toUpperCase()}</strong>.</p>`
            };
        },
        supportReply(ticketId: string, message: string) {
            return {
                subject: `PerfectExpress | New Support Message: ${ticketId}`,
                text: `You have a new message regarding ticket ${ticketId}.`,
                html: `<h1>Support Ticket Update</h1><p>A new response has been posted to ticket <strong>${ticketId}</strong>.</p><p>Preview: "${message.substring(0, 50)}..."</p>`
            }
        }
    }
};
