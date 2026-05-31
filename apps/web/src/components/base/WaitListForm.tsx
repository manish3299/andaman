"use client";

import { useState } from "react";

export default function WaitListForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Waitlist signup:", email);

    alert("Thanks for joining the waitlist!");

    setEmail("");
  };

  return (
    <div className="w-full mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            flex-1
            h-14
            rounded-xl
            border
            border-white/10
            bg-black/40
            px-4
            text-white
            outline-none
            backdrop-blur-xl
          "
        />

        <button
          type="submit"
          className="
            h-14
            px-8
            rounded-xl
            bg-white
            text-black
            font-semibold
            hover:scale-105
            transition-all
          "
        >
          Join Waitlist
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-400">
        <span>✓ Early Access</span>
        <span>✓ Founding Member Benefits</span>
        <span>✓ Product Updates</span>
      </div>
    </div>
  );
}