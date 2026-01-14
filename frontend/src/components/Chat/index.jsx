import { useEffect, useState, useRef, useMemo } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from "../../services/chat.service";
import { socket } from "../../../socket/chat.socket";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingMsgId, setPendingMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.role;

  if (currentUserRole === "admin") return null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    if (!open || !currentUserId || conversationId) return;

    const initChat = async () => {
      try {
        const { data: conv } = await getOrCreateConversation();
        setConversationId(conv.id);

        const { data: msgs } = await getMessages(conv.id);
        setMessages(
          msgs.map((m) => ({
            ...m,
            sender_id: Number(m.sender_id),
            createdAt: m.createdAt ? new Date(m.createdAt) : null,
          }))
        );
      } catch (err) {
        console.error("Lỗi khởi tạo chat:", err);
      }
    };

    initChat();
  }, [open, currentUserId, conversationId]);

  useEffect(() => {
    if (!open || !conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleReceiveMessage = (msg) => {
      const normalizedMsg = {
        ...msg,
        sender_id: Number(msg.sender_id),
        createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      };

      setMessages((prev) => {
        if (pendingMsgId && normalizedMsg.sender_id === currentUserId) {
          return prev.map((m) =>
            m.id === pendingMsgId ? { ...normalizedMsg, isSending: false } : m
          );
        }
        if (prev.some((m) => m.id === normalizedMsg.id)) return prev;
        return [...prev, normalizedMsg];
      });

      if (normalizedMsg.sender_id === currentUserId) {
        setPendingMsgId(null);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => socket.off("receive_message", handleReceiveMessage);
  }, [open, conversationId, pendingMsgId, currentUserId]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId || sending) return;

    setSending(true);

    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      content: trimmed,
      sender_id: currentUserId,
      createdAt: new Date(),
      isSending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setPendingMsgId(tempId);
    setInput("");

    try {
      await sendMessage({ conversationId, content: trimmed });
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200"
        aria-label="Mở chat hỗ trợ"
      >
        <MessageCircle size={28} />
      </button>

      {open && (
        <div
          className={`
            fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden
            border border-gray-200 font-futura-regular transition-all duration-300
            
            /* Desktop mặc định */
            bottom-24 right-6 w-90 h-100
            
            /* Tablet & Mobile lớn (≥ 768px) */
            md:bottom-6 md:right-6 md:w-[65%] md:h-[70vh] md:max-w-lg md:rounded-2xl
            
            /* Mobile nhỏ (< 768px) - full bottom, chiếm ~70% width */
            bottom-0 right-0 w-[85%] max-w-[95vw] h-[68vh] rounded-t-2xl rounded-b-none
            
            max-h-[calc(100vh-8px)]
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                CS
              </div>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs opacity-90">Thường trả lời trong vài phút</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Đóng chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              const time = msg.createdAt
                ? msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";

              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
                  <div
                    className={`
                      max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm relative break-words whitespace-pre-wrap
                      ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                      }
                    `}
                  >
                    {msg.content}
                    {msg.isSending && (
                      <Loader2 size={14} className="absolute -bottom-1 -right-1 text-white animate-spin" />
                    )}
                    <span
                      className={`text-xs mt-1 block opacity-70 text-right ${
                        isMe ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {time}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Aa..."
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className={`
                p-3 rounded-full transition-all duration-200
                ${
                  sending || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }
              `}
              aria-label="Gửi tin nhắn"
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}