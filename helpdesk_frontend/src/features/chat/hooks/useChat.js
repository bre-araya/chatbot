import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setEmail } from "../chatSlice";
import { sendMessageAsync } from "../chatThunks";

export default function useChat(userEmail) {
  const messages = useSelector((state) => state.chat.messages);
  const status = useSelector((state) => state.chat.status);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  // Store email in Redux when component mounts or userEmail changes
  useEffect(() => {
    if (userEmail) {
      dispatch(setEmail(userEmail));
    }
  }, [userEmail, dispatch]);

  const handleSend = () => {
    if (!input.trim() || status === "loading") return;

    const newMessage = {
      id: Date.now(),
      email: userEmail,
      sender: "user",
      question: input,
      text: input,
      timestamp: new Date().toISOString()
    };

    dispatch(addMessage(newMessage));

    dispatch(sendMessageAsync({ message: input, email: userEmail }));

    setInput(""); // clear input
  };

  return { messages, input, setInput, handleSend };
}
