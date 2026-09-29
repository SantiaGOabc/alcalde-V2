import { useState } from 'react';
import { sectionId } from '@/cms/anchors';
import { CATEGORIAS_GESTION, LABELS_CATEGORIA } from '@constant';
import Button from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/Confirm';
import { FIELD_CLASS } from '@/components/ui/fieldStyles';
import Pagination from '@/components/ui/Pagination';
import { useDebouncedValue, usePagedList } from '@/hooks';
import { ApiError, createWork, deleteWork, listWorks, setWorkPublished, updateWork, type Work, type WorkInput } from '@/lib';
import { showToast } from '@utils';
import PreviewFrame from '../PreviewFrame';
import WorkForm from './WorkForm';

const PAGE_SIZE = 8;
const ALL = 'all';

/** `Work` a editar, o `'new'` para el formulario en blanco. */
type Editing = Work | 'new' | null;

const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : 'No se pudo completar la acción.');

export default function WorksManager() {
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Editing>(null);
  const [category, setCategory] = useState(ALL);
  const [search, setSearch] = useState('');
  // Cada cambio guardado recarga la página real en la vista previa.
  const [reloadToken, setReloadToken] = useState(0);

  const q = useDebouncedValue(search.trim());
  const list = usePagedList(
    (query) => listWorks({ ...query, pageSize: PAGE_SIZE }),
    { category: category === ALL ? undefined : category, q },
  );

  const afterChange = () => {
    list.refresh();
    setReloadToken((token) => token + 1);
  };

  const handleSave = async (input: WorkInput) => {
    if (editing === 'new') await createWork(input);
    else await updateWork((editing as Work).id, input);

    showToast({ variant: 'success', title: editing === 'new' ? 'Obra creada' : 'Obra actualizada', message: input.titulo });
    setEditing(null);
    afterChange();
  };

  const togglePublished = async (work: Work) => {
    try {
      await setWorkPublished(work.id, !work.publicada);
      list.patchItem((item) => item.id === work.id, { publicada: !work.publicada });
      setReloadToken((token) => token + 1);
      showToast({
        variant: 'success',
        title: work.publicada ? 'Obra despublicada' : 'Obra publicada',
        message: work.publicada ? 'Ya no se ve en la página de Gestión.' : 'Ya se ve en la página de Gestión.',
      });
    } catch (error) {
      showToast({ variant: 'error', message: errorMessage(error) });
    }
  };

  const remove = async (work: Work) => {
    const accepted = await confirm({
      title: 'Eliminar obra',
      message: `«${work.titulo}» se eliminará de forma permanente. Si solo quieres ocultarla, usa "Despublicar".`,
      confirmLabel: 'Eliminar',
      tone: 'danger',
    });
    if (!accepted) return;

    try {
      await deleteWork(work.id);
      showToast({ variant: 'success', title: 'Obra eliminada', message: work.titulo });
      // Si era la única de su página, se retrocede una para no quedar en una página vacía.
      if (list.items.length === 1 && list.page > 1) list.setPage(list.page - 1);
      afterChange();
    } catch (error) {
      showToast({ variant: 'error', message: errorMessage(error) });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(24rem,30rem)_1fr]">
      <section className="flex min-w-0 flex-col gap-5" aria-label="Obras">
        {editing ? (
          <WorkForm
            key={editing === 'new' ? 'new' : editing.id}
            work={editing === 'new' ? null : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Obras</h2>
                <p className="text-sm text-slate-500">{list.total} en total con este filtro</p>
              </div>
              <Button type="button" onClick={() => setEditing('new')}>+ Nueva obra</Button>
            </header>

            <div className="flex flex-wrap gap-3">
              <input type="search" aria-label="Buscar obra" placeholder="Buscar por título" value={search} onChange={(e) => setSearch(e.target.value)} className={`${FIELD_CLASS} min-w-40 flex-1`} />
              <select aria-label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} className={`${FIELD_CLASS} w-auto`}>
                <option value={ALL}>Todas las categorías</option>
                {CATEGORIAS_GESTION.map((id) => <option key={id} value={id}>{LABELS_CATEGORIA[id] ?? id}</option>)}
              </select>
            </div>

            {list.error && <p role="alert" className="text-sm font-semibold text-red-700">{list.error}</p>}

            <ul className={`flex flex-col gap-3 transition-opacity ${list.isLoading ? 'opacity-50' : ''}`}>
              {list.items.map((work) => (
                <li key={work.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <img src={work.portada.src} alt="" loading="lazy" className="size-16 shrink-0 rounded-lg bg-slate-100 object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div>
                      <p className="truncate text-sm font-bold text-slate-900">{work.titulo}</p>
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        {LABELS_CATEGORIA[work.categoria] ?? work.categoria}
                        <span className={`rounded-full px-2 py-0.5 font-bold ${work.publicada ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {work.publicada ? 'Publicada' : 'Borrador'}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(work)}>Editar</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => togglePublished(work)}>
                        {work.publicada ? 'Despublicar' : 'Publicar'}
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => remove(work)}>Eliminar</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {!list.isLoading && list.items.length === 0 && !list.error && (
              <p className="py-10 text-center text-sm text-slate-500">No hay obras con ese filtro.</p>
            )}

            <Pagination page={list.page} pageSize={list.pageSize} total={list.total} isLoading={list.isLoading} onPageChange={list.setPage} />
          </>
        )}
      </section>

      <aside aria-label="Vista previa" className="h-[70vh] xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
        <PreviewFrame path="/management" anchor={sectionId('management.works')} reloadToken={reloadToken} />
      </aside>
    </div>
  );
}
