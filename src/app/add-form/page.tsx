"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Metaplex, irysStorage, walletAdapterIdentity } from "@metaplex-foundation/js";

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
      alert("Please connect your Phantom Wallet first.");
      return;
    }

    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }

    setStatus("🚀 Uploading to IPFS via Pinata...");

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
      setStatus("❌ Failed to upload to Pinata");
      return;
    }

    const uri = data.uri;
    console.log("✅ IPFS URI:", uri);

    setStatus("⛓ Minting NFT...");

    if (!wallet) return;

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

    await fetch("/api/savePrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mintAddress: nft.address.toBase58(),
        title,
        prompt,
        category,
        imageUri: uri,
      }),
    });

    console.log("🎉 NFT created:", nft);
    setStatus(`✅ NFT created! Address: ${nft.address.toBase58()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📝 Upload a Prompt
      </h2>

      <input
        type="text"
        placeholder="Prompt title"
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-4 py-3 text-gray-700 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-4 py-3 text-gray-700 transition"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="general">General</option>
        <option value="midjourney">Midjourney</option>
        <option value="chatgpt">ChatGPT</option>
        <option value="copywriting">Copywriting</option>
      </select>

      <textarea
        placeholder="Prompt text"
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-4 py-3 text-gray-700 resize-none h-36 transition"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 cursor-pointer text-gray-600 hover:bg-indigo-50 transition"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
          }
        }}
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        Upload and Mint
      </button>

      <div className="text-center text-sm text-gray-500 italic">{status}</div>
    </form>
  );
}