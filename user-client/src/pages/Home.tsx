import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { shortCode } = useContext(AuthContext)
  const [target, setTarget] = useState("")
  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome</h1>
      <p>Your Code: <strong>{shortCode}</strong></p>

      <h2>Start Conversation</h2>
      <input
        placeholder="Enter intended recipient code (e.g. sharp-cipher-4198)"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      <button onClick={() => navigate(`/chat/${target}`)}>
        Open Chat
      </button>
    </div>
  )
}