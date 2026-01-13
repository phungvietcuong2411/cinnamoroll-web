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
  const [pendingMsgId, setPendingMsgId] = useState(null); // Track pending optimistic msg
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

  // Admin không dùng widget này
  if (currentUserRole === "admin") return null;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect socket once
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Init conversation khi mở chat
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
        console.error("Chat init error:", err);
      }
    };

    initChat();
  }, [open, currentUserId, conversationId]);

  // Join room & listen realtime messages
  useEffect(() => {
    if (!open || !conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleReceive = (msg) => {
      const normalized = {
        ...msg,
        sender_id: Number(msg.sender_id),
        createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      };

      setMessages((prev) => {
        // Nếu có pendingMsgId và msg này từ user (vừa gửi), thay thế optimistic
        if (pendingMsgId && normalized.sender_id === currentUserId) {
          return prev.map((m) =>
            m.id === pendingMsgId
              ? { ...normalized, isSending: false }
              : m
          );
        }

        // Nếu không trùng, thêm mới (nếu chưa tồn tại)
        if (prev.some((m) => m.id === normalized.id)) return prev;
        return [...prev, normalized];
      });

      // Clear pending sau khi thay thế
      if (normalized.sender_id === currentUserId) {
        setPendingMsgId(null);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
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

    // Optimistic UI: thêm tin nhắn tạm
    setMessages((prev) => [...prev, optimisticMsg]);
    setPendingMsgId(tempId); // Track id tạm
    setInput(""); // Clear input ngay

    try {
      await sendMessage({
        conversationId,
        content: trimmed,
      });
      // Backend sẽ emit socket → handleReceive sẽ thay thế
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
      // Xử lý lỗi: xóa optimistic hoặc đánh dấu lỗi
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(trimmed); // Restore input nếu lỗi
    } finally {
      setSending(false);
    }
  };

  // Focus input khi mở chat
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      {/* Nút mở chat - giống Messenger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 font-futura-regular"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                CS
              </div>
              <div>
                <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                <p className="text-xs opacity-90">Thường trả lời trong vài phút</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              const time = msg.createdAt
                ? msg.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
                >
<div
  className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm relative
    break-words whitespace-pre-wrap
    ${
      isMe
        ? "bg-blue-600 text-white rounded-br-none"
        : "bg-white text-gray-900 rounded-bl-none border"
    }`}
>
  {msg.content}

  {msg.isSending && (
    <Loader2
      size={14}
      className="absolute -bottom-1 -right-1 text-white animate-spin"
    />
  )}

  <span
    className={`text-xs mt-1 block opacity-70 text-right
      ${isMe ? "text-blue-100" : "text-gray-500"}`}
  >
    {time}
  </span>
</div>

                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-white border-t flex items-center gap-2">
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
              placeholder="Aa"
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={sending}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className={`p-3 rounded-full transition-all duration-200
                ${
                  sending || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
            >
              {sending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}