"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Metaplex, irysStorage, walletAdapterIdentity, toMetaplexFile } from "@metaplex-foundation/js";

export default function UploadPromptForm() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      alert("Сначала подключи Phantom Wallet");
      return;
    }

    if (!imageFile) {
      alert("Пожалуйста, выбери изображение для загрузки.");
      return;
    }

    setStatus("🚀 Загружаем на IPFS через Pinata...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("prompt", prompt);
    formData.append("category", category);
    formData.append("image", imageFile);

    const response = await fetch("/api/uploadToPinata", {
      method: "POST",

      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("❌ Ошибка при загрузке на Pinata");
      return;
    }

    const uri = data.uri;
    console.log("✅ IPFS URI:", uri);

    setStatus("⛓ Минтим NFT...");

    if (!wallet) return

    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet))
      .use(
        irysStorage({
          address: "https://devnet.bundlr.network",
          providerUrl: "https://api.devnet.solana.com",
          timeout: 60000,
        })
      );

    const { nft } = await metaplex.nfts().create({
      uri,
      name: title,
      sellerFeeBasisPoints: 0,
      symbol: "PBZ",
      creators: [{ address: wallet.publicKey, share: 100 }],
    });

    console.log("🎉 NFT создан:", nft);
    setStatus(`✅ NFT создан! Адрес: ${nft.address.toBase58()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mt-8 p-4 border rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">📝 Загрузить промпт</h2>

      <input
        type="text"
        placeholder="Название промпта"
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
        <option value="general">Общий</option>
        <option value="midjourney">Midjourney</option>
        <option value="chatgpt">ChatGPT</option>
        <option value="copywriting">Копирайтинг</option>
      </select>

      <textarea
        placeholder="Текст промпта"
        className="w-full border p-2 rounded h-32"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        className="w-full border p-2 rounded"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
          }
        }}
        required
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Загрузить и заминтить
      </button>

      <div className="text-sm text-gray-600">{status}</div>
    </form>
  );
}