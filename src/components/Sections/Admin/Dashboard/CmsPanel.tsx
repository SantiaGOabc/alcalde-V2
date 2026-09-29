import { useState } from 'react';
import type { CmsSectionState } from '@/cms/sections';
import Button from '@/components/ui/Button';
import { ConfirmProvider } from '@/components/ui/Confirm';
import { logout } from '@/lib';
import ContentManager from './ContentManager';
import MessagesPanel from './MessagesPanel';
import WorksManager from './Works/WorksManager';

interface CmsPanelProps {
  username: string;
  sections: CmsSectionState[];
  /** Mensajes sin leer al cargar el panel (la insignia se mantiene al día después). */
  initialUnread: number;
}

type Tab = 'content' | 'works' | 'messages';

const TABS: { id: Tab; label: string }[] = [
  { id: 'content', label: 'Contenido' },
  { id: 'works', label: 'Obras' },
  { id: 'messages', label: 'Buzón' },
];

export default function CmsPanel({ username, sections, initialUnread }: CmsPanelProps) {
  const [tab, setTab] = useState<Tab>('content');
  const [unread, setUnread] = useState(initialUnread);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    window.location.reload();
  };

  const tabClass = (value: Tab) =>
    `border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
      tab === value ? 'border-(--brand-primary) text-(--brand-primary)' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`;

  return (
    <ConfirmProvider>
      <div className="flex flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Panel de contenido</h1>
            <p className="mt-1 text-sm text-slate-500">Sesión de <strong>{username}</strong></p>
          </div>
          <div className="flex gap-2">
            <Button href="/" variant="outline" size="sm">Ver sitio</Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
          </div>
        </header>

        <div role="tablist" className="flex gap-6 border-b border-slate-200">
          {TABS.map(({ id, label }) => (
            <button key={id} role="tab" type="button" aria-selected={tab === id} className={tabClass(id)} onClick={() => setTab(id)}>
              {label}
              {id === 'messages' && unread > 0 && (
                <span className="ml-2 rounded-full bg-(--brand-primary) px-2 py-0.5 text-xs text-white">{unread}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'content' && <ContentManager sections={sections} />}
        {tab === 'works' && <WorksManager />}
        {tab === 'messages' && <MessagesPanel onUnreadChange={setUnread} />}
      </div>
    </ConfirmProvider>
  );
}
