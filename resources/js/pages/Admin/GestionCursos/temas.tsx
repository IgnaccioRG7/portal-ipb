import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { ChevronLeft, BarChart } from 'lucide-react';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';

export default function GestionTemas({ curso, modulo, materia, profesor, temas }: any) {
    
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: admin.cursos.index().url },
    { title: curso.nombre, href: admin.gestion.modulos(curso.id).url },
    { title: modulo.nombre, href: admin.gestion.materias({ curso: curso.id, modulo: modulo.id }).url },
    { title: materia.nombre, href: admin.gestion.temas({ curso: curso.id, modulo: modulo.id, materia: materia.id, profesor: profesor.id }).url }
  ];

  const columns = [
    { key: 'codigo_tema', label: 'Código' },
    { key: 'nombre', label: 'Nombre del Tema' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'estado',
      label: 'Estado',
      render: (tema: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${tema.estado === 'activo' ? 'bg-green-500 text-white' :
            tema.estado === 'borrador' ? 'bg-yellow-500 text-white' : 'bg-gray-300'
          }`}>
          {tema.estado}
        </span>
      )
    },
    {
      key: 'profesor',
      label: 'Profesor',
      render: (tema: any) => tema.profesor?.name || '—'
    },
    {
      key: 'total_preguntas',
      label: 'Preguntas',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (tema: any) => (
        <Link
          href={admin.gestion.resultados({
            curso: curso.id,
            modulo: modulo.id,
            materia: materia.id,
            tema: tema.id
          }).url}
          className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1"
          title="Ver resultados"
        >
          <BarChart size={16} /> Ver Resultados
        </Link>
      )
    }
  ];

  return (
    <ContentLayout
      title={`Temas: ${materia.nombre}`}
      subtitle={`${curso.nombre} → ${modulo.nombre}`}
      breadcrumbs={breadcrumbs}
    >
      <Head title="Temas de la Materia" />
      <DataTable columns={columns} data={temas} />
    </ContentLayout>
  );
}