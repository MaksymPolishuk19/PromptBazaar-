import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const prompt = formData.get("prompt") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;

    if (!title || !prompt || !category || !image) {
      return NextResponse.json(
        { message: "Отсутствуют необходимые поля" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imageBase64 = imageBuffer.toString("base64");

    const metadata = {
      name: title,
      description: `Категория: ${category}`,
      image: `data:${image.type};base64,${imageBase64}`,
    };

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      }
    );

    const cid = response.data.IpfsHash;
    const uri = `https://gateway.pinata.cloud/ipfs/${cid}`;

    return NextResponse.json({ uri });
  } catch (error) {
    console.error('Ошибка при загрузке на Pinata:', error);
    return NextResponse.json(
      { message: 'Ошибка при загрузке на Pinata' },
      { status: 500 }
    );
  }
}