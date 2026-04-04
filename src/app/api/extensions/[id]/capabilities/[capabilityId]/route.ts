import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { getRealExtension, updateRealExtensionCapability } from '@/server/hermes/real-extensions';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; capabilityId: string }> }) {
  const { id, capabilityId } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    enabled?: boolean;
    scope?: 'global' | 'profile' | 'session';
  };

  try {
    const profileId = await getSelectedProfileFromCookie();
    const extension = getRealExtension(profileId, id);
    if (!extension) throw new Error('Extension not found');
    const capability = extension.capabilities.find((item) => item.id === capabilityId);
    if (!capability) throw new Error('Capability not found');
    const updated = updateRealExtensionCapability(profileId, id, capability.name, body);
    return NextResponse.json({ extension: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update capability' }, { status: 404 });
  }
}
