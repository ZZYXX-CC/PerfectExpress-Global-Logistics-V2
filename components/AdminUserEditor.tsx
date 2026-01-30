import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { supabase } from '../services/supabase';
import { useToast } from './ui/Toast';
import { UserProfile } from '../services/adminService';

interface AdminUserEditorProps {
    userProfile: UserProfile | null;
    onSave: () => void;
    onCancel: () => void;
    onImpersonate?: (userId: string) => void;
}

const AdminUserEditor: React.FC<AdminUserEditorProps> = ({ userProfile, onSave, onCancel, onImpersonate }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'client',
        company: '',
        address: ''
    });

    // Fetch additional user details when editing
    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.full_name || '',
                email: userProfile.email || '',
                phone: (userProfile as any).phone || '',
                role: userProfile.role || 'client',
                company: (userProfile as any).company || '',
                address: (userProfile as any).address || ''
            });
        }
    }, [userProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    company: formData.company,
                    address: formData.address,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userProfile.id);

            if (error) throw error;

            toast.showSuccess('Saved', 'User profile updated');
            onSave();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.showError('Error', 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = () => {
        if (userProfile && onImpersonate) {
            onImpersonate(userProfile.id);
        }
    };

    if (!userProfile) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onCancel}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-bgMain border border-borderColor rounded-sm p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-8 border-b border-borderColor pb-4">
                    <h2 className="text-2xl font-black heading-font uppercase tracking-tighter text-textMain">
                        User // <span className="text-red-600">Profile</span>
                    </h2>
                    <button onClick={onCancel} className="text-textMuted hover:text-red-600 transition-colors">
                        <Icon icon="solar:close-circle-linear" width="24" />
                    </button>
                </div>

                {/* User Avatar and Key Info */}
                <div className="flex items-center gap-6 mb-8 p-4 bg-bgSurface/50 rounded-sm border border-borderColor">
                    <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-black text-red-600">
                            {formData.fullName?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="text-lg font-black text-textMain uppercase">{formData.fullName || 'Unnamed User'}</div>
                        <div className="text-xs text-textMuted">{formData.email}</div>
                        <div className="text-[10px] text-textMuted mt-1">
                            Member since {new Date(userProfile.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    {onImpersonate && (
                        <button
                            type="button"
                            onClick={handleImpersonate}
                            className="px-4 py-2 border border-orange-500 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-orange-500 hover:text-black transition-colors flex items-center gap-2"
                        >
                            <Icon icon="solar:login-3-linear" />
                            Login As User
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="metadata-label text-textMuted mb-1 block">Full Name</label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-bgSurface border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none uppercase"
                                placeholder="FULL NAME"
                            />
                        </div>
                        <div>
                            <label className="metadata-label text-textMuted mb-1 block">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-bgSurface border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none"
                                placeholder="USER EMAIL"
                            />
                            <p className="text-[9px] text-orange-500 mt-1 font-bold uppercase tracking-wide">
                                <Icon icon="solar:danger-triangle-linear" className="inline mr-1" />
                                Updates profile only - Login credentials unchanged
                            </p>
                        </div>
                        <div>
                            <label className="metadata-label text-textMuted mb-1 block">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-bgSurface border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div>
                            <label className="metadata-label text-textMuted mb-1 block">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-bgSurface border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none uppercase"
                            >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="metadata-label text-textMuted mb-1 block">Company</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full bg-bgSurface border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none uppercase"
                                placeholder="COMPANY NAME"
                            />
                        </div>
                        <div>
                            <label className="metadata-label text-textMuted mb-1 block">Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-bgSurface border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none uppercase"
                                placeholder="STREET ADDRESS"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-borderColor">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-textMain transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-red-600 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AdminUserEditor;
