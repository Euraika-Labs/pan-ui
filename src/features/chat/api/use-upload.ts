'use client';

import { useMutation } from '@tanstack/react-query';
import { trackClientEvent } from '@/lib/telemetry/client';
import type { MessageAttachment } from '@/lib/types/message';

export function useUploadAttachment() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/uploads', { method: 'POST', body: formData });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const body = (await response.json()) as { attachment: MessageAttachment };
      trackClientEvent('attachment.uploaded', { name: file.name, size: file.size });
      return body.attachment;
    },
  });
}
