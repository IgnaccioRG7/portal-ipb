import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Layers, Eye } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import cursos from '@/routes/cursos';

export default function CursoModulos({ curso, modulos }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cursos', href: cursos.index().url },
        { title: curso.nombre, href: '#' }
    ];

    const columns = [
        { key: 'codigo_modulo', label: 'Código' },
        { key: 'nombre', label: 'Módulo' },
        { 
            key: 'fecha_inicio', 
            label: 'Inicio',
            render: (modulo: any) => new Date(modulo.fecha_inicio).toLocaleDateString()
        },
        { 
            key: 'fecha_fin', 
            label: 'Fin',
            render: (modulo: any) => new Date(modulo.fecha_fin).toLocaleDateString()
        },
        { key: 'total_materias', label: 'Materias' },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (modulo: any) => (
                <Link
                    href={cursos.materias({
                        curso: curso.id,
                        modulo: modulo.id
                    })}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1 dark:hover:text-blue-500"
                >
                    <Eye size={18} /> Ver Materias
                </Link>
            )
        }
    ];

    return (
        <ContentLayout
            title={`Módulos de ${curso.nombre}`}
            subtitle="Selecciona un módulo para ver tus materias asignadas"
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Módulos - ${curso.nombre}`} />
            <DataTable columns={columns} data={modulos} />
        </ContentLayout>
    );
}