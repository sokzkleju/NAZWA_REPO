import React, { useState, useEffect } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import Tesseract from "tesseract.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

GlobalWorkerOptions.workerSrc = pdfWorker;

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [tab, setTab] = useState("calendar");
  const [quizInput, setQuizInput] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [questionCount, setQuestionCount] = useState(3);
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setEvents(previousEvents => {
        const updatedEvents = previousEvents.map(event => {
          const eventTime = new Date(event.date);
          const reminderTime = new Date(eventTime.getTime() - 15 * 60 * 1000);
          const withinReminderWindow = now >= reminderTime && now < new Date(reminderTime.getTime() + 60000);

          if (withinReminderWindow && !event.notified) {
            const notificationWindow = window.open("", "notification", "width=400,height=200");
            if (notificationWindow) {
              const notificationHtml = `
                <html>
                  <head>
                    <title>⏰ Przypomnienie</title>
                    <style>
                      body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #1f2937; color: white; text-align: center; }
                      h1 { font-size: 1.5rem; margin-bottom: 10px; }
                      p { font-size: 1rem; background-color: #374151; padding: 10px; border-radius: 8px; }
                    </style>
                  </head>
                  <body>
                    <h1>⏰ Przypomnienie</h1>
                    <p>${event.text}</p>
                  </body>
                </html>`;
              notificationWindow.document.write(notificationHtml);
              notificationWindow.focus();
            }
            return { ...event, notified: true };
          }
          return event;
        });
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        return updatedEvents;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [events]);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username, password);
      alert("Zarejestrowano!");
    } catch (error) {
      alert("Błąd rejestracji: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      setCurrentUser(username);
      alert("Zalogowano!");
    } catch (error) {
      alert("Błąd logowania: " + error.message);
    }
  };

  const generateAffirmation = () => {
    const affirmations = [
      "Dasz radę!",
      "Mało ci zostało!",
      "Jesteś wystarczający!",
      "Zrobisz to!",
      "Dziś będzie dobry dzień!",
      "Jesteś silniejszy niż myślisz!",
      "Nie poddawaj się!",
      "Twoja praca ma znaczenie!"
    ];
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-4">🔐 Logowanie / Rejestracja</h2>
          <input className="mb-2 p-2 rounded w-full bg-gray-700 text-white" placeholder="Email" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" className="mb-4 p-2 rounded w-full bg-gray-700 text-white" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
          <div className="flex gap-2 justify-center">
            <button className="bg-blue-600 px-4 py-2 rounded" onClick={handleLogin}>Zaloguj</button>
            <button className="bg-green-600 px-4 py-2 rounded" onClick={handleRegister}>Zarejestruj</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">👋 Witaj, {currentUser}</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setTab("calendar")} className={`px-4 py-2 rounded-t-lg ${tab === "calendar" ? "bg-blue-700" : "bg-gray-700"}`}>📅 Kalendarz</button>
        <button onClick={() => setTab("quiz")} className={`px-4 py-2 rounded-t-lg ${tab === "quiz" ? "bg-blue-700" : "bg-gray-700"}`}>🧠 Quiz</button>
        <button onClick={() => setTab("affirmations")} className={`px-4 py-2 rounded-t-lg ${tab === "affirmations" ? "bg-blue-700" : "bg-gray-700"}`}>💬 Pozytywne afirmacje</button>
      </div>

      {tab === "affirmations" && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">💬 Pozytywne afirmacje</h2>
          <button onClick={generateAffirmation} className="bg-green-600 px-4 py-2 rounded mb-4">Wygeneruj afirmację</button>
          {affirmation && <p className="text-lg mt-2 bg-blue-700 p-4 rounded">{affirmation}</p>}
        </div>
      )}
    </div>
  );
}




GlobalWorkerOptions.workerSrc = pdfWorker;

export default function App() {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("currentUser") || null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [tab, setTab] = useState("calendar");
  const [quizInput, setQuizInput] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [questionCount, setQuestionCount] = useState(3);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setEvents(previousEvents => {
        const updatedEvents = previousEvents.map(event => {
          const eventTime = new Date(event.date);
          const reminderTime = new Date(eventTime.getTime() - 15 * 60 * 1000);
          const withinReminderWindow = now >= reminderTime && now < new Date(reminderTime.getTime() + 60000);

          if (withinReminderWindow && !event.notified) {
            const notificationWindow = window.open("", "notification", "width=400,height=200");
            if (notificationWindow) {
              const notificationHtml = `
                <html>
                  <head>
                    <title>⏰ Przypomnienie</title>
                    <style>
                      body {
                        margin: 0;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        background-color: #1f2937;
                        color: white;
                        text-align: center;
                      }
                      h1 {
                        font-size: 1.5rem;
                        margin-bottom: 10px;
                      }
                      p {
                        font-size: 1rem;
                        background-color: #374151;
                        padding: 10px;
                        border-radius: 8px;
                      }
                    </style>
                  </head>
                  <body>
                    <h1>⏰ Przypomnienie</h1>
                    <p>${event.text}</p>
                  </body>
                </html>
              `;
              notificationWindow.document.write(notificationHtml);
              notificationWindow.focus();
            }
            return { ...event, notified: true };
          }

          return event;
        });

        localStorage.setItem("events", JSON.stringify(updatedEvents));
        return updatedEvents;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentUser ? (
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">👤 Zalogowany jako: {currentUser}</h2>
            <button className="bg-red-600 px-4 py-2 rounded" onClick={() => {
              setCurrentUser(null);
              localStorage.removeItem("currentUser");
            }}>Wyloguj</button>
          </div>

          <div className="flex gap-4 mb-4">
            <button onClick={() => setTab("calendar")} className={`px-4 py-2 rounded-t-lg ${tab === "calendar" ? "bg-blue-700" : "bg-gray-700"}`}>📅 Kalendarz</button>
            <button onClick={() => setTab("quiz")} className={`px-4 py-2 rounded-t-lg ${tab === "quiz" ? "bg-blue-700" : "bg-gray-700"}`}>🧠 Generator quizów</button>
          </div>

          {tab === "calendar" && (
            <div className="flex gap-4">
              <div className="w-1/4 bg-gray-800 rounded-lg p-4">
                <p className="mb-2 text-lg font-semibold">Dodaj wydarzenie</p>
                <input type="datetime-local" className="w-full mb-2 p-2 rounded bg-gray-700 text-white" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <input type="text" placeholder="Opis wydarzenia" className="w-full mb-2 p-2 rounded bg-gray-700 text-white" value={text} onChange={e => setText(e.target.value)} />
                <button className="w-full bg-blue-600 hover:bg-blue-700 rounded p-2" onClick={() => {
                  if (!text || !selectedDate || !currentUser) return;
                  const newEvents = [...events, { text, date: selectedDate, user: currentUser, notified: false }];
                  setEvents(newEvents);
                  localStorage.setItem("events", JSON.stringify(newEvents));
                  setText("");
                  setSelectedDate("");
                }}>➕ Dodaj</button>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">📌 Twoje wydarzenia</h2>
                {events.filter(e => e.user === currentUser).length === 0 ? (
                  <p className="text-gray-400">Brak wydarzeń.</p>
                ) : (
                  <ul className="space-y-2">
                    {events.filter(e => e.user === currentUser).map((event, index) => (
                      <li key={index} className="bg-blue-700 p-2 rounded">
                        <strong>{new Date(event.date).toLocaleString("pl-PL")}</strong>: {event.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === "quiz" && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Wklej tekst lub prześlij plik, aby wygenerować quiz</h2>
              <div className="flex items-center gap-4 mb-4">
                <textarea className="w-full h-40 p-3 rounded bg-gray-700 text-white" placeholder="Wklej dowolny tekst..." value={quizInput} onChange={e => setQuizInput(e.target.value)} />
                <div className="w-32">
                  <label className="block text-sm mb-1">Liczba pytań:</label>
                  <input type="number" min={1} max={50} className="w-full p-2 rounded bg-gray-700 text-white" value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))} />
                </div>
              </div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.type === "application/pdf") {
                  const reader = new FileReader();
                  reader.onload = async function (e) {
                    const typedArray = new Uint8Array(e.target.result);
                    const pdf = await getDocument({ data: typedArray }).promise;
                    let text = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const content = await page.getTextContent();
                      const strings = content.items.map(item => item.str).join(" ");
                      text += strings + "\n";
                    }
                    setQuizInput(prev => prev + "\n" + text);
                  };
                  reader.readAsArrayBuffer(file);
                } else if (file.type.startsWith("image/")) {
                  const imageUrl = URL.createObjectURL(file);
                  const { data } = await Tesseract.recognize(imageUrl, "pol");
                  setQuizInput(prev => prev + "\n" + data.text);
                }
              }} className="mb-4" />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded" onClick={() => {
                if (!quizInput.trim()) return;
                const sentences = quizInput.split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
                const questions = [];
                const openTemplates = [
                  (s, i) => `${i + 1}. Jakie informacje można wyciągnąć ze zdania: "${s}"?\nOdpowiedź: ___________________________`,
                  (s, i) => `${i + 1}. Jakie są możliwe skutki tego stwierdzenia: "${s}"?\nOdpowiedź: ___________________________`,
                  (s, i) => `${i + 1}. Jakie pytania można postawić na podstawie zdania: "${s}"?\nOdpowiedź: ___________________________`
                ];
                const fakeAnswers = [
                  "Jest to pytanie niezwiązane z tekstem.",
                  "To popularna opinia, ale nie jest oparta na tekście.",
                  "To jest mylące stwierdzenie."
                ];
                for (let i = 0; i < questionCount; i++) {
                  const sentence = sentences[Math.floor(Math.random() * sentences.length)] || quizInput;
                  const type = Math.random();
                  if (type < 0.33) {
                    const correct = sentence;
                    const options = [...fakeAnswers];
                    options.splice(Math.floor(Math.random() * 4), 0, correct);
                    questions.push(`${i + 1}. Co oznacza zdanie: "${sentence}"?\nA) ${options[0]}\nB) ${options[1]}\nC) ${options[2]}\nD) ${options[3]}`);
                  } else if (type < 0.66) {
                    questions.push(`${i + 1}. Czy poniższe zdanie jest prawdziwe?\n"${sentence}"\n☐ Tak    ☐ Nie`);
                  } else {
                    const template = openTemplates[Math.floor(Math.random() * openTemplates.length)];
                    questions.push(template(sentence, i));
                  }
                }
                setGeneratedQuiz(`🧠 Quiz na podstawie tekstu:\n\n${questions.join("\n\n")}`);
              }}>🎯 Wygeneruj quiz</button>
              {generatedQuiz && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">📋 Wygenerowany quiz:</h3>
                  <textarea className="w-full h-64 p-3 rounded bg-gray-700 text-white whitespace-pre-wrap" value={generatedQuiz} readOnly />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded" onClick={() => {
                      navigator.clipboard.writeText(generatedQuiz);
                      alert("Quiz został skopiowany do schowka! ✅");
                    }}>📋 Skopiuj do schowka</button>
                    <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded" onClick={() => {
                      const sentences = quizInput.split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
                      const questions = [];
                      for (let i = 0; i < questionCount; i++) {
                        const sentence = sentences[Math.floor(Math.random() * sentences.length)] || quizInput;
                        questions.push(`${i + 1}. Co oznacza zdanie: "${sentence}"?`);
                      }
                      setGeneratedQuiz(`🧠 Quiz na podstawie tekstu:\n\n${questions.join("\n\n")}`);
                    }}>🎲 Wygeneruj inny quiz</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">🔐 Logowanie / Rejestracja</h2>
            <input className="mb-2 p-2 rounded w-full bg-gray-700 text-white" placeholder="Nazwa użytkownika" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" className="mb-4 p-2 rounded w-full bg-gray-700 text-white" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
            <div className="flex gap-2 justify-center">
              <button className="bg-blue-600 px-4 py-2 rounded" onClick={() => {
                const user = users.find(u => u.username === username && u.password === password);
                if (!user) {
                  window.alert("Nieprawidłowa nazwa lub hasło użytkownika");
                  return;
                }
                setCurrentUser(user.username);
                localStorage.setItem("currentUser", user.username);
                window.alert("Zalogowano pomyślnie!");
              }}>Zaloguj</button>
              <button className="bg-green-600 px-4 py-2 rounded" onClick={() => {
                if (!username || !password) return alert("Uzupełnij nazwę i hasło");
                if (users.find(u => u.username === username)) return alert("Użytkownik już istnieje");
                const newUsers = [...users, { username, password }];
                setUsers(newUsers);
                localStorage.setItem("users", JSON.stringify(newUsers));
                alert("Zarejestrowano pomyślnie");
              }}>Zarejestruj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
