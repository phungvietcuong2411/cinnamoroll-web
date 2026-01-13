import axios from "./Axios/axios"

export const getOrCreateConversation = () => {
  return axios.get("api/chat/conversation")
}

export const getMessages = (conversationId) => {
  return axios.get(`api/chat/messages/${conversationId}`)
}

export const sendMessage = (data) => {
  return axios.post("api/chat/send", data)
}

export const getAllConversationsForAdmin = () => {
  return axios.get("api/chat/admin/conversations")
}