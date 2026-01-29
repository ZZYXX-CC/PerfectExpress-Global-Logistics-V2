import React from 'react';
import { Shipment } from '../types';

interface ShipmentDetailsProps {
  shipment: Shipment;
  onClose: () => void;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-bgMain/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-bgSurface w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-borderColor">
        <div className="sticky top-0 p-8 bg-bgSurface border-b border-borderColor flex justify-between items-center z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <iconify-icon icon="solar:delivery-linear" width="16" class="text-red-600"></iconify-icon>
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Tracking Details</span>
            </div>
            <h2 className="text-3xl font-black heading-font uppercase tracking-tight text-textMain">ID: {shipment.id}</h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-red-600 hover:text-white rounded-full transition-all bg-bgMain text-textMuted border border-borderColor">
            <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
          </button>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="p-8 bg-bgMain/40 rounded border border-borderColor relative">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] ${
                    shipment.status === 'Delivered' ? 'bg-green-600/20 text-green-500' : 'bg-red-600 text-white'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-textMuted uppercase font-black tracking-widest mb-1">Package Weight</p>
                  <p className="text-xl font-black text-textMain">{shipment.weight}</p>
                </div>
              </div>
              
              <div className="relative pl-10 border-l border-borderColor space-y-12">
                <div>
                   <div className="absolute left-[-5.5px] top-1 w-[11px] h-[11px] bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                   <p className="text-[9px] text-textMuted uppercase font-black tracking-widest mb-1">Sent From</p>
                   <p className="text-xl font-bold text-textMain">{shipment.origin}</p>
                </div>
                <div>
                   <div className="absolute left-[-5.5px] bottom-1 w-[11px] h-[11px] bg-textMuted border border-borderColor rounded-full"></div>
                   <p className="text-[9px] text-textMuted uppercase font-black tracking-widest mb-1">Destination</p>
                   <p className="text-xl font-bold text-textMain">{shipment.destination}</p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-borderColor flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-textMuted uppercase font-black tracking-widest mb-1">Estimated Arrival</p>
                  <p className="text-2xl font-black text-red-600">{shipment.estimatedArrival}</p>
                </div>
                <iconify-icon icon="solar:clock-circle-linear" width="32" class="text-textMuted"></iconify-icon>
              </div>
            </div>
            
            <div className="p-8 bg-bgMain/40 border-l-2 border-red-600 rounded-r-sm">
              <div className="flex items-center gap-2 mb-4">
                <iconify-icon icon="solar:info-circle-linear" width="16" class="text-red-600"></iconify-icon>
                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Quick Status Update</h4>
              </div>
              <p className="text-xs text-textMuted leading-relaxed font-medium italic">
                "Your package is moving smoothly through our network. Everything is on schedule, and we expect delivery as planned."
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-10">
              <iconify-icon icon="solar:history-linear" width="20" class="text-red-600"></iconify-icon>
              <h3 className="text-lg font-black heading-font uppercase tracking-tight text-textMain">Package History</h3>
            </div>
            <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-borderColor">
              {shipment.history.map((event, idx) => (
                <div key={idx} className="relative pl-10 group">
                  <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-bgMain border border-borderColor rounded flex items-center justify-center transition-all group-hover:border-red-600">
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  </div>
                  <p className="text-[9px] text-red-500 font-black tracking-widest mb-1 uppercase">{event.date} // {event.time}</p>
                  <p className="text-sm font-black text-textMain uppercase tracking-tight mb-1">{event.location}</p>
                  <p className="text-[11px] text-textMuted font-medium leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;