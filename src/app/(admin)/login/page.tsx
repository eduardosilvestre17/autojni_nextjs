"use client";

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log("Tentativa de login:", { email, password });
    // Lógica de autenticação, fetch API, etc.
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Área de Admin</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="exemplo@dominio.com"
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
