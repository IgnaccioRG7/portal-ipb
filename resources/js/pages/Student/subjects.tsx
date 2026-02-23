import { Input } from '@/components/ui/input';
import ContentLayout from '@/layouts/content-layout';
import { dashboard } from '@/routes';
import estudiante from '@/routes/estudiante';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import {
  Search,
  PlayCircle,
  BookOpen,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: dashboard().url,
  },
  {
    title: 'Materias',
    href: '#'
  }
];

// Interfaces actualizadas
interface Tema {
  id: number;
  nombre: string;
  descripcion: string;
  codigo_tema: string;
  modulo_materia_id: number;
  acceso_id?: number;
}

interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
}

interface MateriaConTemas {
  modulo_materia_id: number;
  materia: Materia;
  temas: Tema[];
  total_temas: number;
}

interface Modulo {
  id: number;
  codigo_modulo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  materias: MateriaConTemas[];
  total_materias: number;
  total_temas: number;
}

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  total_modulos: number;
  total_materias: number;
  total_temas: number;
}

interface Props {
  curso: Curso;
  modulos: Modulo[];
}

function MateriaCard({ data, modulo, cursoId }: {
  data: MateriaConTemas;
  modulo: Modulo;
  cursoId: number;
}) {
  const { materia, temas } = data;
  const [expandida, setExpandida] = useState(false);

  const handleIniciarTemas = () => {
    router.visit(estudiante.topics({
      curso: cursoId,
      modulo: modulo.id,
      materia: materia.id,
    }));
  };

  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800 flex flex-col mb-4">
      {/* Header de la materia */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
        onClick={() => setExpandida(!expandida)}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {materia.nombre}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {temas.length} tema{temas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {modulo.nombre}
          </span>
          {expandida ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Contenido expandible */}
      {expandida && (
        <div className="p-4 border-t dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {materia.descripcion}
          </p>

          {/* Lista de temas */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Temas disponibles:
            </h4>
            <ul className="space-y-2">
              {temas.map((tema) => (
                <li
                  key={tema.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {tema.nombre}
                    </span>
                    {tema.descripcion && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {tema.descripcion}
                      </p>
                    )}
                  </div>
                  <button
                    className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.visit(estudiante.tema.resultados({
                        curso: cursoId,
                        materia: materia.id,
                        modulo: modulo.id,
                        tema: tema.id
                      }).url);
                    }}
                  >
                    <BarChart3 size={16} />
                    Puntaje
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón de acción */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleIniciarTemas();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
          >
            <PlayCircle className="h-4 w-4" />
            Iniciar todos los temas
          </button>
        </div>
      )}
    </article>
  );
}

function ModuloCard({ modulo, cursoId }: { modulo: Modulo; cursoId: number }) {
  const [expandido, setExpandido] = useState(false);

  const fechaInicio = new Date(modulo.fecha_inicio).toLocaleDateString()
  const fechaFin = new Date(modulo.fecha_fin).toLocaleDateString()

  return (
    <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800 mb-6 overflow-hidden">
      {/* Header del módulo */}
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                {modulo.nombre}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {fechaInicio} - {fechaFin}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {modulo.total_materias} materia{modulo.total_materias !== 1 ? 's' : ''}
              </div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">
                {modulo.total_temas} tema{modulo.total_temas !== 1 ? 's' : ''}
              </div>
            </div>
            {expandido ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Contenido del módulo */}
      {expandido && (
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4">
            {modulo.materias.map((materia) => (
              <MateriaCard
                key={materia.modulo_materia_id}
                data={materia}
                modulo={modulo}
                cursoId={cursoId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Index({ curso, modulos }: Props) {
  console.log(curso);
  console.log(modulos);

  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar módulos que contengan materias que coincidan con la búsqueda
  const modulosFiltrados = modulos
    .map(modulo => ({
      ...modulo,
      materias: modulo.materias.filter(materia =>
        materia.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materia.materia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(modulo => modulo.materias.length > 0);

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title={curso.nombre}
      subtitle={curso.descripcion}
    >
      {/* Stats del curso */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Módulos</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                {curso.total_modulos}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Materias</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                {curso.total_materias}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Temas</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                {curso.total_temas}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buscador */}
      <section className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar materia por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </section>

      {/* Lista de módulos */}
      <section>
        {modulosFiltrados.length > 0 ? (
          modulosFiltrados.map((modulo) => (
            <ModuloCard
              key={modulo.id}
              modulo={modulo}
              cursoId={curso.id}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              No se encontraron materias aun en este curso
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? `No hay materias que coincidan con "${searchTerm}"`
                : 'No hay módulos disponibles en este curso'}
            </p>
          </div>
        )}
      </section>
    </ContentLayout>
  );
}