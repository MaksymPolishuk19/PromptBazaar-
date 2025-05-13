"use client";

import React from 'react';
import dynamic from "next/dynamic";


const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  

export default function Header() {
  return (
    <div className='flex justify-between items-center'>
        <div>PromtBazaar</div>
        <WalletMultiButton/>
    </div>
  )
}
