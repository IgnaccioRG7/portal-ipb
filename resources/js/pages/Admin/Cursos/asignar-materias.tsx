import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Tema {
  id: number;
  codigo_tema: string;
  nombre: string;
  tipo: string;
  estado: string;
}

interface Materia {
  id: number;
  codigo_materia: string;
  nombre: string;
  area: string;
  color: string;
}

interface MateriaAsignada {
  id: number;
  nombre: string;
  codigo_materia: string;
  horas_semanales: number;
  estado: string;
}

interface Curso {
  id: number;
  nombre: string;
  codigo_curso: string;
}

interface Props {
  curso: Curso;
  todasLasMaterias: Materia[];
  materiasAsignadas: MateriaAsignada[];
  temasPorMateria: Record<number, Tema[]>;
  errors: Record<string, string>;
  processing: boolean;
}

export default function AsignarMaterias({
  curso,
  todasLasMaterias,
  materiasAsignadas,
  temasPorMateria, // ✅ Nuevo
  errors = {},
  processing = false
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: admin.cursos.index().url },
    { title: curso.nombre, href: admin.cursos.index().url },
    { title: 'Asignar Materias', href: '#' },
  ];

  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<
    { materia_id: number; horas_semanales: number; estado: string }[]
  >(
    materiasAsignadas.map(m => ({
      materia_id: m.id,
      horas_semanales: m.horas_semanales,
      estado: m.estado,
    }))
  );

  const [temasAbiertos, setTemasAbiertos] = useState<Record<number, boolean>>({}); // ✅ Estado para controlar qué materias están abiertas

  const agregarMateria = (materiaId: number) => {
    if (!materiasSeleccionadas.find(m => m.materia_id === materiaId)) {
      setMateriasSeleccionadas([
        ...materiasSeleccionadas,
        { materia_id: materiaId, horas_semanales: 2, estado: 'activo' },
      ]);
    }
  };

  const eliminarMateria = (materiaId: number) => {
    setMateriasSeleccionadas(materiasSeleccionadas.filter(m => m.materia_id !== materiaId));
  };

  const actualizarMateria = (materiaId: number, campo: string, valor: any) => {
    setMateriasSeleccionadas(
      materiasSeleccionadas.map(m =>
        m.materia_id === materiaId ? { ...m, [campo]: valor } : m
      )
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(admin.cursos.guardarMaterias({
      curso: curso.id
    }).url, {
      materias: materiasSeleccionadas
    });
  };

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title={`Asignar Materias a: ${curso.nombre}`}
      subtitle="Selecciona las materias que formarán parte de este curso"
    >
      <Head title={`Asignar Materias - ${curso.nombre}`} />

      <section className="pt-0 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={submit} className="space-y-6">
            {/* Selector de materias */}
            <div>
              <Label htmlFor="materia_selector">Agregar Materia</Label>
              <Select onValueChange={(value) => agregarMateria(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia para agregar" />
                </SelectTrigger>
                <SelectContent>
                  {todasLasMaterias
                    .filter(m => !materiasSeleccionadas.find(ms => ms.materia_id === m.id))
                    .map(materia => (
                      <SelectItem key={materia.id} value={materia.id.toString()}>
                        {materia.nombre} ({materia.codigo_materia})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <InputError message={errors.materias as string} />
            </div>

            {/* Lista de materias asignadas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Materias Asignadas ({materiasSeleccionadas.length})
              </h3>

              {materiasSeleccionadas.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay materias asignadas aún</p>
              ) : (
                <div className="space-y-3">
                  {materiasSeleccionadas.map(ms => {
                    const materia = todasLasMaterias.find(m => m.id === ms.materia_id);
                    if (!materia) return null;

                    const temas = temasPorMateria[materia.id] || []; // ✅ Obtener temas de esta materia
                    const isOpen = temasAbiertos[materia.id] || false;

                    return (
                      <div
                        key={ms.materia_id}
                        className="border rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        {/* Header de la materia */}
                        <div className="flex items-center gap-4 p-4">
                          <div className="flex-1">
                            <p className="font-semibold">{materia.nombre}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {materia.codigo_materia} • {materia.area}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-32">
                              <Label className="text-xs">Horas/Semana</Label>
                              <Input
                                type="number"
                                min="1"
                                max="20"
                                value={ms.horas_semanales}
                                onChange={e =>
                                  actualizarMateria(
                                    ms.materia_id,
                                    'horas_semanales',
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </div>

                            <div className="w-32">
                              <Label className="text-xs">Estado</Label>
                              <Select
                                value={ms.estado}
                                onValueChange={value =>
                                  actualizarMateria(ms.materia_id, 'estado', value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="activo">Activo</SelectItem>
                                  <SelectItem value="inactivo">Inactivo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* ✅ Botón para ver temas */}
                            <Collapsible
                              open={isOpen}
                              onOpenChange={(open) => setTemasAbiertos({ ...temasAbiertos, [materia.id]: open })}
                            >
                              <CollapsibleTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  title={`Ver temas (${temas.length})`}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                >
                                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>

                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => eliminarMateria(ms.materia_id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>

                        {/* ✅ Listado de temas desplegable */}
                        <Collapsible
                          open={isOpen}
                          onOpenChange={(open) => setTemasAbiertos({ ...temasAbiertos, [materia.id]: open })}
                        >
                          <CollapsibleContent className="px-4 pb-4">
                            <div className="bg-white dark:bg-gray-800 rounded-md p-3 border">
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <FileText size={16} />
                                Temas de esta materia ({temas.length})
                              </h4>

                              {temas.length === 0 ? (
                                <p className="text-xs text-gray-500">No hay temas registrados</p>
                              ) : (
                                <ul className="space-y-1">
                                  {temas.map((tema) => (
                                    <li
                                      key={tema.id}
                                      className="text-sm flex items-center justify-between py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    >
                                      <span>
                                        <strong>{tema.codigo_tema}</strong>: {tema.nombre}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {/* <span className={`text-xs px-2 py-0.5 rounded ${tema.tipo === 'lectura' ? 'bg-blue-100 text-blue-700' :
                                            tema.tipo === 'opcional' ? 'bg-purple-100 text-purple-700' :
                                              'bg-yellow-100 text-yellow-700'
                                          }`}>
                                          // {tema.tipo}
                                        </span> */}
                                        <span className={`text-xs px-2 py-0.5 rounded ${tema.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                          }`}>
                                          {tema.estado}
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4 justify-end border-t pt-4">
              <Link
                href={admin.cursos.index().url}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                disabled={processing || materiasSeleccionadas.length === 0}
                className="bg-green-600 text-white hover:bg-green-500"
              >
                {processing ? 'Guardando...' : 'Guardar Materias'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </ContentLayout>
  );
}