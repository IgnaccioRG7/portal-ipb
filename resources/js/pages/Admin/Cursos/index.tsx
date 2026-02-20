import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Eye, LayoutList, Pencil, Plus, SlidersHorizontal } from 'lucide-react';
import cursos from '@/routes/cursos';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';

interface Curso {
  codigo_curso: string
  estado: string
  id: number
  materias_count: number
  nivel: string
  nombre: string
  precio: string
}

export default function CursosIndex({ cursos: cursosData }: { cursos: Curso[] }) {
  
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: admin.cursos.index().url },
  ];
  
  const handleToggleEstado = (curso: any) => {
    router.patch(admin.cursos.toggleEstado(curso.id).url, {}, {
      preserveScroll: true,
    });
  };

  const columns = [
    { key: 'codigo_curso', label: 'Código' },
    { key: 'nombre', label: 'Nombre del Curso' },
    { key: 'nivel', label: 'Nivel' },
    {
      key: 'precio',
      label: 'Precio (Bs)',
      render: (curso: Curso) => `${curso.precio} Bs`
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (curso: Curso) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={curso.estado === 'activo'}
            onCheckedChange={() => handleToggleEstado(curso)}
            aria-label="Cambiar estado del curso"
          />
          <Label className="text-xs">
            {curso.estado === 'activo' ? (
              <span className="text-green-600 font-semibold">Activo</span>
            ) : (
              <span className="text-red-600 font-semibold">Inactivo</span>
            )}
          </Label>
        </div>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (curso: Curso) => (
        <div className="flex items-center gap-2">
          <Link
            href={admin.cursos.edit(curso.id).url}
            className="text-blue-600 hover:text-blue-900 flex items-center gap-1 border-b border-transparent hover:border-blue-900"
            title="Editar curso"
          >
            <Pencil size={16} /> Editar
          </Link>
          <Link
            href={admin.cursos.asignarMaterias(curso.id).url}
            className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1 border-b border-transparent hover:border-emerald-900"
            title="Asignar materias"
          >
            <SlidersHorizontal size={16} /> Materias
          </Link>
          <Link
            href={admin.gestion.modulos({
              curso: curso.id
            }).url}
            className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1 border-b border-transparent hover:border-cyan-900"
            title="Gestionar este curso"
          >
            <LayoutList size={16} /> Gestionar
          </Link>
        </div>
      )
    }
  ];

  return (
    <ContentLayout
      title="Gestión de Cursos"
      subtitle="Administra los cursos de la plataforma"
      breadcrumbs={breadcrumbs}
      actions={<div className="">
        <Link href={admin.cursos.create().url}>
          <Button className="bg-green-600 hover:bg-green-500">
            <Plus size={18} className="mr-2" /> Crear Curso
          </Button>
        </Link>
      </div>}
    >
      <Head title="Cursos" />

      <DataTable columns={columns} data={cursosData} />
    </ContentLayout>
  );
}