"use server";
import fs from 'fs';
import path from 'path';

export async function getTagInputCode() {
  const filePath = path.join(process.cwd(), 'components/tag-input.tsx');
  const tagInputCode = await fs.readFileSync(filePath, 'utf8');

  return {
    code: {
      tagInputCode,
    },
  };
}

export async function getTagInputDemoCode() {
    const filePath = path.join(process.cwd(), 'components/sections/hero.tsx');
    const tagInputDemoCode = fs.readFileSync(filePath, 'utf8');
  
    return {
      code: {
        tagInputDemoCode,
      },
    };
}

