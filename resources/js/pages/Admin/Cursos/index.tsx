import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Eye, Pencil, Plus } from 'lucide-react';
import cursos from '@/routes/cursos';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function CursosIndex({ cursos: cursosData }: { cursos: any[] }) {
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
      render: (curso: any) => `${curso.precio} Bs`
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (curso: any) => (
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
      render: (curso: any) => (
        <div className="flex items-center gap-2">
          <Link
            href={admin.cursos.edit(curso.id).url}
            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
            title="Editar curso"
          >
            <Pencil size={16} /> Editar
          </Link>
          <Link
            href={admin.cursos.asignarMaterias(curso.id).url}
            className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
            title="Asignar materias"
          >
            <Eye size={16} /> Materias
          </Link>
        </div>
      )
    }
  ];

  return (
    <ContentLayout
      title="Gestión de Cursos"
      subtitle="Administra los cursos de la plataforma"
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