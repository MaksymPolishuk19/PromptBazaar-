import NFTGallery from "@/components/NFTgallery/NFTgallery";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 drop-shadow-md">
        PromptBazaar
      </h1>
      <div className="w-full max-w-7xl">
        <NFTGallery />
      </div>
    </div>
  );
}