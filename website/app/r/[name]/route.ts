import { NextResponse } from 'next/server';

import { registryIndex, registryItems } from '@/registry/registry';

export const dynamic = 'force-static';

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
}

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name: rawName } = await context.params;
  const name = rawName.replace(/\.json$/, '');

  if (name === 'index' || name === 'registry') return jsonResponse(registryIndex);

  const item = registryItems.find((candidate) => candidate.name === name);
  if (!item) return jsonResponse({ error: `Unknown registry item: ${name}` }, 404);

  return jsonResponse(item);
}
