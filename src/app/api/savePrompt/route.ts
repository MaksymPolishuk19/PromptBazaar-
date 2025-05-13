import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const promptsFilePath = path.join(process.cwd(), 'data', 'prompts.json');

export async function POST(req: NextRequest) {
  try {
    const newPrompt = await req.json();

    let prompts = [];
    try {
      const data = await fs.readFile(promptsFilePath, 'utf8');
      prompts = JSON.parse(data);
    } catch (err) {
      prompts = [];
    }

    prompts.push(newPrompt);

    await fs.writeFile(promptsFilePath, JSON.stringify(prompts, null, 2));

    return NextResponse.json({ message: 'Промпт сохранен' }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при сохранении промпта:', error);
    return NextResponse.json({ message: 'Ошибка при сохранении промпта' }, { status: 500 });
  }
}