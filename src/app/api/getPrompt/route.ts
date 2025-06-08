import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const promptsFilePath = path.join(process.cwd(), 'data', 'prompts.json');

interface Prompt {
  mintAddress: string;
  title: string;
  prompt: string;
  category: string;
  imageUri: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mintAddress = searchParams.get('mintAddress');

  if (!mintAddress) {
    return NextResponse.json({ message: 'Отсутствует mintAddress' }, { status: 400 });
  }

  try {
    const data = await fs.readFile(promptsFilePath, 'utf8');
    const prompts: Prompt[] = JSON.parse(data);
    console.log(prompts);
    
    const promptEntry = prompts.find((p) => p.mintAddress === mintAddress);

    if (!promptEntry) {
      return NextResponse.json({ message: 'Промпт не найден' }, { status: 404 });
    }

    return NextResponse.json({ prompt: promptEntry.prompt }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при чтении промптов:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}