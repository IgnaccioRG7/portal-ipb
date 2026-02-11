// TODOHOY: VER SI BORRAR ESTE ARCHIVO DE UNA VEZ YA QUE SE ESTA CREANDO EN LA RUTA DE PROFESOR

import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Edit } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import cursos from '@/routes/cursos';

export default function MateriaTemas({ curso, materia, temas }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cursos', href: '/admin/cursos' },
        { title: curso.nombre, href: `/admin/cursos/${curso.id}/materias` },
        { title: materia.nombre, href: '#' }
    ];

    const columns = [
        { key: 'codigo_tema', label: 'Código' },
        { key: 'nombre', label: 'Tema' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'total_preguntas', label: 'Preguntas' },
        {
            key: 'estado',
            label: 'Estado',
            render: (tema: any) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    tema.estado === 'activo' ? 'bg-green-500 text-white' : 'bg-gray-300'
                }`}>
                    {tema.estado}
                </span>
            )
        },
        {
            key: 'acciones',
            label: 'Editar',
            render: (tema: any) => (
                <Link
                    // href={`/admin/temas/${tema.id}/edit`}
                    href={cursos.temas.edit({
                      curso: curso.id,
                      materia: materia.id,
                      tema: tema.id
                    }).url}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                >
                    <Edit size={18} /> Editar Quiz
                </Link>
            )
        }
    ];

    return (
        <ContentLayout
            title={`Temas de ${materia.nombre}`}
            subtitle={`En el curso: ${curso.nombre}`}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Temas - ${materia.nombre}`} />
            <DataTable columns={columns} data={temas} />
        </ContentLayout>
    );
}