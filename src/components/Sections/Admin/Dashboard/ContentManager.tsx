import { useCallback, useMemo, useRef, useState } from 'react';
import type { CmsKey, CmsSectionState } from '@/cms/sections';
import { useConfirm } from '@/components/ui/Confirm';
import { FIELD_CLASS } from '@/components/ui/fieldStyles';
import SectionEditor from './SectionEditor';

interface ContentManagerProps {
  sections: CmsSectionState[];
}

/** Agrupa las secciones por página conservando el orden del registro. */
const groupByPage = (sections: CmsSectionState[]) =>
  sections.reduce<Map<string, CmsSectionState[]>>((groups, section) => {
    groups.set(section.page, [...(groups.get(section.page) ?? []), section]);
    return groups;
  }, new Map());

export default function ContentManager({ sections: initial }: ContentManagerProps) {
  const [sections, setSections] = useState(initial);
  const [activeKey, setActiveKey] = useState<CmsKey>(initial[0].key);
  const isDirty = useRef(false);
  const confirm = useConfirm();

  const active = sections.find((section) => section.key === activeKey) ?? sections[0];
  const groups = useMemo(() => groupByPage(sections), [sections]);

  const select = async (key: CmsKey) => {
    if (key === activeKey) return;

    if (isDirty.current) {
      const discard = await confirm({
        title: 'Cambios sin guardar',
        message: 'Tienes cambios sin guardar en esta sección. Si cambias de sección se perderán.',
        confirmLabel: 'Descartar y cambiar',
        tone: 'danger',
      });
      if (!discard) return;
    }

    isDirty.current = false;
    setActiveKey(key);
  };

  const handlePersisted = useCallback(
    (next: CmsSectionState) => setSections((current) => current.map((s) => (s.key === next.key ? next : s))),
    [],
  );
  const handleDirtyChange = useCallback((value: boolean) => {
    isDirty.current = value;
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-md flex-col gap-1.5">
        <label htmlFor="section-select" className="text-[11px] font-bold tracking-wide text-slate-700 uppercase">
          Sección a editar
        </label>
        <select
          id="section-select"
          value={active.key}
          onChange={(event) => void select(event.target.value as CmsKey)}
          className={FIELD_CLASS}
        >
          {[...groups].map(([page, items]) => (
            <optgroup key={page} label={page}>
              {items.map((section) => (
                <option key={section.key} value={section.key}>
                  {section.label}
                  {section.overridden ? ' • editado' : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <SectionEditor key={active.key} section={active} onPersisted={handlePersisted} onDirtyChange={handleDirtyChange} />
    </div>
  );
}
