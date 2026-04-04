import { AppShell } from '@/components/layout/app-shell';
import { ChatScreen } from '@/features/chat/components/chat-screen';
import { requireAuth } from '@/server/auth/guards';

export default async function ChatPage() {
  await requireAuth();

  return (
    <AppShell>
      <ChatScreen />
    </AppShell>
  );
}
