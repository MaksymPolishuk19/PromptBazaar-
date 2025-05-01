"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function UploadPromptForm() {
  const { publicKey } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert("Сначала подключи Phantom Wallet");
      return;
    }

    console.log("Prompt submitted by:", publicKey.toBase58());
    console.log("Title:", title);
    console.log("Prompt:", prompt);
    console.log("Category:", category);

    // Здесь позже добавим IPFS и минт NFT
  };

  return (
        <div className="flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="max-w-xl mt-8 p-4 border rounded-2xl shadow-sm space-y-4 text-center"
            >
                <h2 className="text-xl font-semibold">📝 Загрузити промпт</h2>

                <input
                    type="text"
                    placeholder="Назва промпта"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <select
                    className="w-full border p-2 rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="general">Для всього</option>
                    <option value="midjourney">Midjourney</option>
                    <option value="chatgpt">ChatGPT</option>
                    <option value="copywriting">Копірайтинг</option>
                </select>

                <textarea
                    placeholder="Текст промпта"
                    className="w-full border p-2 rounded h-32"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-100"
                >
                    Загрузити
                </button>
            </form>
        </div>
  );
}