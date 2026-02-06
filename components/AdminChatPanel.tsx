import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '../services/supabase';
import { useToast } from './ui/Toast';
import {
  ChatMessage,
  ChatSession,
  getAllChatSessions,
  getChatMessages,
  sendChatMessage,
  updateChatSessionStatus
} from '../services/chatService';

const AdminChatPanel: React.FC = () => {
  const toast = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [adminName, setAdminName] = useState('Support Agent');
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadAdminName = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Support Agent';
    setAdminName(name);
  }, []);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    const data = await getAllChatSessions();
    setSessions(data);
    setActiveSession(prev => prev || data[0] || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAdminName();
    loadSessions();
  }, [loadAdminName, loadSessions]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime_chat_sessions_admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        () => {
          loadSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadSessions]);

  useEffect(() => {
    if (!activeSession?.id) {
      setMessages([]);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadMessages = async () => {
      const data = await getChatMessages(activeSession.id);
      setMessages(data);
    };

    loadMessages();

    channel = supabase
      .channel(`realtime_chat_messages_admin_${activeSession.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${activeSession.id}` },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [activeSession?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeSession?.id]);

  const handleSendReply = async () => {
    if (!reply.trim() || !activeSession?.id) return;
    const messageText = reply;
    setReply('');
    try {
      await sendChatMessage({
        sessionId: activeSession.id,
        senderType: 'admin',
        senderName: adminName,
        message: messageText
      });
    } catch (err) {
      console.error('Failed to send reply:', err);
      toast.showError('Send Failed', 'Unable to deliver message.');
    }
  };

  const toggleSessionStatus = async () => {
    if (!activeSession) return;
    const nextStatus = activeSession.status === 'active' ? 'closed' : 'active';
    try {
      const updated = await updateChatSessionStatus(activeSession.id, nextStatus);
      setActiveSession(updated);
      toast.showSuccess('Session Updated', `Chat marked ${nextStatus}`);
    } catch (err) {
      console.error('Failed to update session:', err);
      toast.showError('Update Failed', 'Unable to update session status.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 border border-borderColor rounded-sm bg-bgSurface/10 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b border-borderColor flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-textMain">Live Sessions</span>
          <span className="text-[9px] font-bold text-textMuted">{sessions.length}</span>
        </div>
        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-6 text-center text-[10px] uppercase tracking-[0.3em] text-textMuted">
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-textMuted">
              No active chat sessions.
            </div>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session)}
                className={`w-full text-left p-4 border-b border-borderColor/50 hover:bg-white/5 transition-colors ${activeSession?.id === session.id ? 'bg-red-600/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-textMain truncate">{session.user_name}</span>
                  <span className={`text-[9px] uppercase tracking-widest font-black ${session.status === 'active' ? 'text-green-500' : 'text-textMuted'}`}>
                    {session.status}
                  </span>
                </div>
                <p className="text-[10px] text-textMuted truncate">{session.user_email}</p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 border border-borderColor rounded-sm bg-bgSurface/10 backdrop-blur-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-borderColor flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-textMain">Session</p>
            <p className="text-xs text-textMuted">
              {activeSession ? `${activeSession.user_name} • ${activeSession.user_email}` : 'Select a session'}
            </p>
          </div>
          {activeSession && (
            <button
              onClick={toggleSessionStatus}
              className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border border-borderColor rounded-sm hover:border-red-600 text-textMuted hover:text-textMain"
            >
              {activeSession.status === 'active' ? 'Close' : 'Reopen'}
            </button>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4 bg-bgMain/30">
          {!activeSession ? (
            <div className="text-center text-[10px] uppercase tracking-[0.3em] text-textMuted pt-10">
              Select a session
            </div>
          ) : messages.length === 0 ? (
            <div className="text-xs text-textMuted">No messages yet.</div>
          ) : (
            messages.map(message => (
              <div key={message.id} className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-sm text-xs font-medium leading-relaxed ${message.sender_type === 'admin'
                  ? 'bg-red-600/10 text-textMain border border-red-600/30'
                  : 'bg-bgMain text-textMain border border-borderColor'}`}>
                  {message.message}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-borderColor bg-bgMain">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={activeSession ? 'Type your reply...' : 'Select a session first'}
              className="flex-1 bg-bgSurface/40 border border-borderColor rounded-sm px-4 py-3 text-[10px] focus:outline-none focus:border-textMuted text-textMain font-bold tracking-widest uppercase"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              disabled={!activeSession}
            />
            <button
              onClick={handleSendReply}
              disabled={!activeSession || !reply.trim()}
              className="w-12 h-11 bg-red-600 hover:bg-red-700 text-white rounded-sm flex items-center justify-center transition-all disabled:opacity-50"
            >
              <Icon icon="solar:plain-linear" width="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;
