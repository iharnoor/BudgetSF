"use client";

import { useState } from "react";
import { loginUser, User } from "@/lib/auth";

interface LoginModalProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    const user = loginUser(name);
    onLogin(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full mx-4 p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Join BudgetSF
          </h2>
          <p className="text-sm text-muted mt-1">
            Enter your name to start adding spots
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Continue
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
