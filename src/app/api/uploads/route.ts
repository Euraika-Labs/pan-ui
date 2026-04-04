import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { saveUpload } from '@/server/uploads/upload-store';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  const content = await file.text().catch(() => 'Binary file uploaded');
  const upload = saveUpload({
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    content,
  });
  addAuditEvent('attachment_uploaded', 'attachment', upload.id, `Uploaded attachment ${upload.name}.`);
  return NextResponse.json({ attachment: { id: upload.id, name: upload.name, size: upload.size, type: upload.type } }, { status: 201 });
}
