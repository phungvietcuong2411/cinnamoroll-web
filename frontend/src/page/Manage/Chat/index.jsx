import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import {
  getAllConversationsForAdmin,
  getMessages,
  sendMessage,
} from "../../../services/chat.service";
import { MessageCircle, Send, Loader2 } from "lucide-react";

const ADMIN_ID = 5;

/* =========================
   Socket singleton
========================= */
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"),
  },
});

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pendingMsgId, setPendingMsgId] = useState(null); // Track pending optimistic msg

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* =========================
      CONNECT SOCKET (1 LẦN)
  ========================= */
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 ADMIN socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* =========================
      RECEIVE REALTIME MESSAGE
  ========================= */
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 ADMIN received:", msg);

      const normalized = {
        ...msg,
        sender_id: Number(msg.sender_id),
        createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      };

      setMessages((prev) => {
        // Nếu có pendingMsgId và msg này từ admin (vừa gửi), thay thế optimistic
        if (pendingMsgId && normalized.sender_id === ADMIN_ID) {
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
      if (normalized.sender_id === ADMIN_ID) {
        setPendingMsgId(null);
      }

      scrollToBottom();
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [pendingMsgId]);

  /* =========================
      Join / Leave room
  ========================= */
  useEffect(() => {
    if (!selectedConversation?.id) return;

    console.log("🟣 ADMIN join room:", selectedConversation.id);
    socket.emit("join_conversation", selectedConversation.id);

    return () => {
      socket.emit("leave_conversation", selectedConversation.id);
    };
  }, [selectedConversation]);

  /* =========================
      Load conversations
  ========================= */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const res = await getAllConversationsForAdmin();
        setConversations(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  /* =========================
      Select conversation
  ========================= */
  const selectConversation = async (conv) => {
    if (selectedConversation?.id === conv.id) return;

    setSelectedConversation(conv);
    setMessages([]);

    try {
      setLoadingMessages(true);
      const res = await getMessages(conv.id);

      const normalized = res.data.map((m) => ({
        ...m,
        sender_id: Number(m.sender_id),
        createdAt: m.createdAt ? new Date(m.createdAt) : null,
      }));

      setMessages(normalized);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  /* =========================
      Send message (HTTP)
  ========================= */
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !selectedConversation || sending) return;

    setSending(true);

    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      content: trimmed,
      sender_id: ADMIN_ID,
      createdAt: new Date(),
      isSending: true,
    };

    // Optimistic UI: thêm tin nhắn tạm
    setMessages((prev) => [...prev, optimisticMsg]);
    setPendingMsgId(tempId); // Track id tạm
    setText(""); // Clear input ngay
    scrollToBottom();

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        content: trimmed,
      });
      // Backend sẽ emit socket → handleReceive sẽ thay thế
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
      // Xử lý lỗi: xóa optimistic hoặc đánh dấu lỗi
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setText(trimmed); // Restore input nếu lỗi
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  // Focus input khi chọn conversation
  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedConversation]);

  /* =========================
      RENDER (UI CẢI TIẾN)
  ========================= */
  return (
    <div className="p-6 h-full flex flex-col bg-gray-100">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">Tin nhắn khách hàng</h1>

      <div className="bg-white rounded-2xl shadow-xl flex flex-1 overflow-hidden border border-gray-200">
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4 font-semibold flex gap-2 items-center text-gray-700">
            <MessageCircle size={20} className="text-blue-600" /> Hội thoại
          </div>

          {loadingConversations ? (
            <div className="p-4 text-center text-gray-500">Đang tải...</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`w-full text-left px-4 py-4 border-b transition-colors
                  ${selectedConversation?.id === conv.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100"
                  }`}
              >
                <div className="font-medium">{conv.name || "Khách hàng"}</div>
                {/* Nếu backend có last_message, thêm preview ở đây */}
                {/* <p className="text-xs text-gray-500 truncate">Last message preview...</p> */}
              </button>
            ))
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          {selectedConversation && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                {selectedConversation.name?.[0] || "K"}
              </div>
              <div>
                <h3 className="font-semibold">{selectedConversation.name || "Khách hàng"}</h3>
                <p className="text-xs opacity-90">Online</p> {/* Có thể thêm status nếu có */}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {loadingMessages ? (
              <div className="text-center text-gray-500 mt-10">Đang tải tin nhắn...</div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === ADMIN_ID;
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
    ${isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
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
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {selectedConversation && (
            <div className="p-3 bg-white border-t flex items-center gap-2">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
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
                disabled={sending || !text.trim()}
                className={`p-3 rounded-full transition-all duration-200
                  ${sending || !text.trim()
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;