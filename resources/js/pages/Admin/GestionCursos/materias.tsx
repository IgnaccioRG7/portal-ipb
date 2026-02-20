import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { ChevronLeft, BookOpen } from 'lucide-react';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';

export default function GestionMaterias({ curso, modulo, materias }: any) {
  console.log(materias);
  

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: admin.cursos.index().url },
    { title: curso.nombre, href: admin.gestion.modulos(curso.id).url },
    { title: modulo.nombre, href: admin.gestion.materias({ curso: curso.id, modulo: modulo.id }).url }
  ];

  const columns = [
    {
      key: 'nombre',
      label: 'Materia',
      render: (materia: any) => (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: materia.color || '#ccc' }} />
          <span>{materia.nombre}</span>
        </div>
      )
    },
    { key: 'codigo_materia', label: 'Código' },
    { key: 'area', label: 'Área' },
    {
      key: 'profesor',
      label: 'Profesor',
      render: (materia: any) => materia.profesor?.name || '—'
    },
    {
      key: 'total_temas',
      label: 'Temas',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (materia: any) => (
        <Link
          href={admin.gestion.temas({
            curso: curso.id,
            modulo: modulo.id,
            materia: materia.id,
            profesor: materia.profesor.id
          }).url}
          className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1"
          title="Ver temas"
        >
          <BookOpen size={16} /> Ver Temas
        </Link>
      )
    }
  ];

  return (
    <ContentLayout
      title={`Materias: ${modulo.nombre}`}
      subtitle={`Curso: ${curso.nombre}`}
      breadcrumbs={breadcrumbs}
    >
      <Head title="Materias del Módulo" />
      <DataTable columns={columns} data={materias} />
    </ContentLayout>
  );
}