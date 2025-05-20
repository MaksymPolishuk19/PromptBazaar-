"use client";

import React from 'react';
import dynamic from "next/dynamic";
import Link from 'next/link';


const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  

export default function Header() {
  return (
    <div className="flex justify-between items-center mt-2 mb-6 px-4 py-3 bg-white rounded-xl shadow-md max-w-7xl mx-auto">
      <div>
        <WalletMultiButton className="rounded-lg shadow-sm hover:shadow-md transition-shadow" />
      </div>
      <nav className="flex gap-8 text-gray-700 font-medium text-lg">
        <Link
          href="/"
          className="hover:text-indigo-600 transition-colors duration-300"
        >
          Home
        </Link>
        <Link
          href="/add-form"
          className="hover:text-indigo-600 transition-colors duration-300"
        >
          Upload Prompt
        </Link>
      </nav>
    </div>
  )
}
