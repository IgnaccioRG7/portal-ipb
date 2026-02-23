import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Eye } from 'lucide-react';
import cursos from '@/routes/cursos';

export default function CursosIndex({ cursos : cursosData }: { cursos: any[] }) {
  console.log(cursosData);
  
  const columns = [
    { key: 'codigo_curso', label: 'Código' },
    { key: 'nombre', label: 'Nombre del Curso' },
    { key: 'nivel', label: 'Nivel' },
    { key: 'total_modulos', label: 'Módulos' },
    {
      key: 'estado',
      label: 'Estado',
      render: (curso: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${curso.estado === 'activo' ? 'bg-green-500 text-white' : 'bg-gray-300'
          }`}>
          {curso.estado}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (curso: any) => (
        <Link
          // href={`/admin/cursos/${curso.id}/materias`}
          href={cursos.modulos({
            curso: curso.id
          }).url}
          className="text-blue-600 hover:text-blue-900 flex items-center gap-1 dark:hover:text-blue-500"
          title="Ver materias"
        >
          <Eye size={18} /> Ver Materias
        </Link>
      )
    }
  ];

  return (
    <ContentLayout
      title="Gestión de Cursos"
      subtitle="Administra los quizzes desde cursos → materias → temas"
    >
      <Head title="Cursos" />
      <DataTable columns={columns} data={cursosData} />
    </ContentLayout>
  );
}