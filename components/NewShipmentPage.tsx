import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipmentForm } from './ShipmentForm';
import { useToast } from './ui/Toast';
import { Icon } from '@iconify/react';

const NewShipmentPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const handleSuccess = (trackingNumber: string) => {
        toast.showSuccess('Shipment Created', `Tracking Number: ${trackingNumber}`);
        navigate('/dashboard');
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-bgMain pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="max-w-2xl mx-auto mb-8">
                    <button
                        onClick={handleCancel}
                        className="text-textMuted text-xs font-bold uppercase tracking-widest hover:text-textMain transition-colors flex items-center gap-2 mb-6"
                    >
                        <Icon icon="solar:arrow-left-linear" /> Return to Dashboard
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black heading-font uppercase tracking-tighter text-textMain mb-2">
                        Create <span className="text-red-600">Shipment</span>
                    </h1>
                    <p className="text-textMuted text-sm font-medium tracking-wide">
                        Fill in the details below to generate a label and tracking number.
                    </p>
                </div>

                <ShipmentForm onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
        </div>
    );
};

export default NewShipmentPage;
