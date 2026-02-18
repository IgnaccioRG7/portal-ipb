import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { FileText, BookOpen } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import cursos from '@/routes/cursos';

export default function ModuloMaterias({ curso, modulo, materias }: any) {
    console.log({ curso, modulo, materias });
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cursos', href: cursos.index().url },
        { title: curso.nombre, href: cursos.modulos(curso.id).url },
        { title: modulo.nombre, href: '#' }
    ];

    const columns = [
        { key: 'codigo_materia', label: 'Código' },
        { key: 'nombre', label: 'Materia' },
        { key: 'area', label: 'Área' },
        { key: 'total_temas', label: 'Temas' },
        {
            key: 'acciones',
            label: 'Temas',
            render: (materia: any) => (
                <Link
                    href={cursos.temas({
                        curso: curso.id,
                        modulo: modulo.id,
                        materia: materia.id
                    })}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1 dark:hover:text-blue-500"
                >
                    <FileText size={18} /> Gestionar Temas
                </Link>
            )
        }
    ];

    return (
        <ContentLayout
            title={`Mis Materias en ${modulo.nombre}`}
            subtitle={`Curso: ${curso.nombre}`}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Materias - ${modulo.nombre}`} />
            <DataTable columns={columns} data={materias} />
        </ContentLayout>
    );
}