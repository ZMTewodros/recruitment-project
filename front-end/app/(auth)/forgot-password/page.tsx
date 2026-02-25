"use client";

import { useState } from "react";
import { apiRequest } from "@/app/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await apiRequest("/auth/forgot-password", "POST", { email });
      setMessage("Reset link sent to your email");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <input
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>Send Reset Link</button>

      <p>{message}</p>
    </div>
  );
}
