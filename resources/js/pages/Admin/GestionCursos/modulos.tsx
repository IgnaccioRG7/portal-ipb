import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { ChevronLeft, FolderOpen } from 'lucide-react';
import admin from '@/routes/admin';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';

export default function GestionModulos({ curso, modulos }: any) {

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: admin.cursos.index().url },
    { title: curso.nombre, href: admin.gestion.modulos(curso.id).url },
  ];


  const columns = [
    { key: 'codigo_modulo', label: 'Código' },
    { key: 'nombre', label: 'Nombre del Módulo' },
    {
      key: 'fecha_inicio',
      label: 'Inicio',
      render: (modulo: any) => new Date(modulo?.fecha_inicio).toLocaleDateString() || '—'
    },
    {
      key: 'fecha_fin',
      label: 'Fin',
      render: (modulo: any) => new Date(modulo?.fecha_fin).toLocaleDateString() || '—'
    },
    {
      key: 'total_materias',
      label: 'Materias',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (modulo: any) => (
        <Link
          href={admin.gestion.materias({
            curso: curso.id,
            modulo: modulo.id
          }).url}
          className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1"
          title="Ver materias"
        >
          <FolderOpen size={16} /> Ver Materias
        </Link>
      )
    }
  ];

  return (
    <ContentLayout
      title={`Módulos: ${curso.nombre}`}
      subtitle="Selecciona un módulo para ver sus materias"
      breadcrumbs={breadcrumbs}
    >
      <Head title="Módulos del Curso" />
      <DataTable columns={columns} data={modulos} />
    </ContentLayout>
  );
}