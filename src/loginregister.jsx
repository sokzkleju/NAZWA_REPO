// LoginRegister.jsx - Komponent do logowania i rejestracji z Firebase
import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function LoginRegister({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Zalogowano pomyślnie");
        onLogin(auth.currentUser);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Zarejestrowano pomyślnie");
        onLogin(auth.currentUser);
      }
    } catch (error) {
      alert("Błąd: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLoginMode ? "Logowanie" : "Rejestracja"}
        </h2>
        <input
          type="email"
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
        >
          {isLoginMode ? "Zaloguj się" : "Zarejestruj się"}
        </button>
        <p
          className="text-center mt-4 cursor-pointer text-blue-400 hover:underline"
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode
            ? "Nie masz konta? Zarejestruj się"
            : "Masz konto? Zaloguj się"}
        </p>
      </form>
    </div>
  );
}
