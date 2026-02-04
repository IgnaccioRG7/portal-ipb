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

function MateriaCard({ data, cursoId }: { data: any; cursoId: number }) {
  const { materia, temas } = data;
  console.log(data);


  const handleIniciarTemas = () => {
    console.log('Iniciar temas');
    router.visit(estudiante.topics({
      curso: cursoId,
      materia: materia.id
    }));
  };

  const handleVerRecursos = () => {
    console.log('Ver recursos');
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg dark:bg-gray-800 flex flex-col">
      {/* Header con imagen */}
      <div className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt={materia.nombre}
          className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {materia.nombre}
          </h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col grow">
        {/* Lista de temas */}
        <div className="mb-4 grow">
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Temas:
          </h4>
          <ul className="space-y-2">
            {temas.map((tema: any) => (

              <li
                key={tema.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm dark:border-gray-500"
              >
                {
                  tema?.tipo !== "directo"
                    ?
                    <>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {tema.nombre}
                      </span>

                      <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                        <PlayCircle size={16} />
                        Entrar
                      </button>
                    </>
                    :
                    <p>Dale clic a iniciar para resolver el Quiz. Exitos!</p>
                }
              </li>
            ))}
          </ul>
        </div>

        {/* Acciones */}
        <div className="space-y-2">
          <button
            onClick={handleIniciarTemas}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
          >
            <PlayCircle className="h-4 w-4" />
            Iniciar Quiz
          </button>
          {/* <button
            onClick={handleVerRecursos}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50" disabled
          >
            <FileText className="h-4 w-4" />
            Ver Recursos
          </button> */}
        </div>
      </div>
    </article>
  );
}

export default function Index({ curso, materias }: any) {
  console.log(curso);
  console.log(materias);

  const [searchTerm, setSearchTerm] = useState('');

  const materiasFiltradas = materias.filter((item: any) =>
    item.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTemas = materias.reduce((acc: number, item: any) => acc + item.temas.length, 0);

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title={curso.nombre}
      subtitle={curso.descripcion}
    >
      {/* Stats */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <div className="flex flex-row-reverse items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Temas</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">{totalTemas}</div>
          </div>
          <div className="rounded-full bg-blue-100 p-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm dark:bg-gray-800">
          <div className="flex flex-row-reverse items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Materias</div>
            <div className="text-2xl font-bold text-purple-600">{materias.length}</div>
          </div>
          <div className="rounded-full bg-purple-100 p-3">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </section>

      {/* Buscador */}
      <section className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </section>

      {/* Grid de Materias */}
      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {materiasFiltradas.map((item: any) => (
            <MateriaCard
              key={item.materia.id}
              data={item}
              cursoId={curso.id}
            />
          ))}
        </div>
      </section>
    </ContentLayout>
  );
}