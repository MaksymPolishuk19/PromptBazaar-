'use client'

import { useEffect, useState } from "react";
import { Metaplex, Nft } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function NFTGallery() {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet.publicKey) return;

      setLoading(true);

      try {
        const connection = new Connection("https://api.devnet.solana.com");
        const metaplex = new Metaplex(connection);

        const owner = wallet.publicKey;
        const nftList = await metaplex.nfts().findAllByOwner({ owner });

        const nftData: Nft[] = [];

        for (const item of nftList) {
          try {
            const nft = await metaplex.nfts().load({ metadata: item });
            nftData.push(nft);
          } catch (error) {
            console.error("Error loading NFT:", error);
          }
        }

        setNfts(nftData);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet.publicKey]);

  const handleShowPrompt = async (mintAddress: string) => {
    try {
      const response = await fetch(`/api/getPrompt?mintAddress=${mintAddress}`);
      if (!response.ok) {
        throw new Error("Prompt not found");
      }
      const data = await response.json();
      setPrompts((prev) => ({ ...prev, [mintAddress]: data.prompt }));
    } catch (error) {
      console.error("Error fetching prompt:", error);
    }
  };

  if (!wallet.connected) {
    return <p className="text-gray-600">Please connect your Phantom Wallet first.</p>;
  }

  if (loading) {
    return <p className="text-gray-600">Loading NFTs...</p>;
  }

  if (nfts.length === 0) {
    return <p className="text-gray-600">You dont own any NFTs.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div
          key={nft.address.toBase58()}
          className="border rounded-xl shadow p-4 bg-white"
        >
          <img
            src={nft.json?.image || ""}
            alt={nft.name}
            className="w-full h-64 object-cover rounded"
          />
          <h3 className="mt-2 text-lg font-semibold">{nft.name}</h3>
          <p className="text-sm text-gray-600">{nft.json?.description || ""}</p>
          <button
            onClick={() => handleShowPrompt(nft.address.toBase58())}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Show Prompt
          </button>
          {prompts[nft.address.toBase58()] && (
            <div className="mt-2 p-2 border rounded bg-gray-100">
              <p className="text-sm text-gray-800">{prompts[nft.address.toBase58()]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}