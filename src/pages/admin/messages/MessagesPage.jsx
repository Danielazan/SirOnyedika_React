// src/pages/admin/messages/MessagesPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Messages page — two-panel layout:
//  LEFT:  conversation list (search + scrollable list with unread badges)
//  RIGHT: selected conversation thread + reply input bar
// On mobile the panels stack and the right panel overlays when a chat is open.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence }             from 'framer-motion';
import { Search, Send, ArrowLeft }             from 'lucide-react';

import { useAdminMessages }  from '../../../hooks/admin/useAdminData';
import TextInput             from '../../../components/ui/TextInput';
import { containerVariants, itemVariants, slideInLeft, slideInRight } from '../../../utils/animation';

// ── Conversation list item ────────────────────────────────────────────────────
function ConversationItem({ conv, isSelected, onClick }) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={() => onClick(conv)}
      className={[
        'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150 border-b border-gray-50',
        isSelected ? 'bg-[#fdf2f0]' : 'hover:bg-gray-50 bg-white',
      ].join(' ')}
    >
      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <img
          src={conv.customer.avatar}
          alt={conv.customer.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        {conv.customer.isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800 truncate">{conv.customer.name}</p>
          <span className="text-[10px] text-gray-400 shrink-0">{conv.timestamp}</span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
      </div>

      {/* Unread badge */}
      {conv.unread > 0 && (
        <span className="shrink-0 min-w-[18px] h-[18px] bg-[#AE3E27] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {conv.unread}
        </span>
      )}
    </motion.button>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isAdmin }) {
  return (
    <motion.div
      variants={isAdmin ? slideInRight : slideInLeft}
      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={[
          'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isAdmin
            ? 'bg-[#AE3E27] text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm',
        ].join(' ')}
      >
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isAdmin ? 'text-[#f8cec7]' : 'text-gray-400'} text-right`}>
          {msg.time}
        </p>
      </div>
    </motion.div>
  );
}

// ── Chat panel ────────────────────────────────────────────────────────────────
function ChatPanel({ conversation, onBack }) {
  const [messages,  setMessages]  = useState(conversation?.messages ?? []);
  const [input,     setInput]     = useState('');
  const bottomRef = useRef(null);

  // Keep messages in sync when conversation changes
  useEffect(() => {
    setMessages(conversation?.messages ?? []);
  }, [conversation?.id]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender: 'admin', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white">
        {/* Back button — mobile only */}
        <button onClick={onBack} className="md:hidden mr-1 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={18} />
        </button>
        <div className="relative shrink-0">
          <img
            src={conversation.customer.avatar}
            alt={conversation.customer.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          {conversation.customer.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{conversation.customer.name}</p>
          <p className="text-xs text-green-500">{conversation.customer.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 bg-white">
        <motion.div
          key={conversation.id}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isAdmin={msg.sender === 'admin'} />
          ))}
          <div ref={bottomRef} />
        </motion.div>
      </div>

      {/* Reply input bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm
                     text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-orange-300 focus:border-transparent transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-xl bg-[#AE3E27] hover:bg-[#8f3320] disabled:opacity-40
                     disabled:cursor-not-allowed flex items-center justify-center text-white
                     shadow transition-colors shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [search,       setSearch]       = useState('');
  const [selectedConv, setSelectedConv] = useState(null);

  const { conversations, loading } = useAdminMessages(search);

  // Auto-select first conversation on load
  useEffect(() => {
    if (!selectedConv && conversations.length > 0) {
      setSelectedConv(conversations[0]);
    }
  }, [conversations]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-[calc(100vh-5rem)] flex rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white"
    >
      {/* ── LEFT PANEL: Conversation list ─────────────────────────────── */}
      <motion.div
        variants={slideInLeft}
        className={[
          'flex flex-col border-r border-gray-100 bg-white',
          // On mobile: full width when no conversation selected, hidden otherwise
          selectedConv ? 'hidden md:flex md:w-72 lg:w-80' : 'flex w-full md:w-72 lg:w-80',
        ].join(' ')}
      >
        {/* Search */}
        <div className="p-4 border-b border-gray-50">
          <TextInput
            placeholder="Search Messages"
            leftIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isSelected={selectedConv?.id === conv.id}
                  onClick={setSelectedConv}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── RIGHT PANEL: Chat thread ────────────────────────────────────── */}
      <motion.div
        variants={slideInRight}
        className={[
          'flex-1 flex flex-col min-w-0',
          // On mobile: only show when conversation is selected
          selectedConv ? 'flex' : 'hidden md:flex',
        ].join(' ')}
      >
        <AnimatePresence mode="wait">
          <ChatPanel
            key={selectedConv?.id}
            conversation={selectedConv}
            onBack={() => setSelectedConv(null)}
          />
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
