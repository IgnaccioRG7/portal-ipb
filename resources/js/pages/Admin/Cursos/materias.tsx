import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { FileText } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import cursos from '@/routes/cursos';

export default function CursoMaterias({ curso, materias }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cursos', href: '/admin/cursos' },
        { title: curso.nombre, href: '#' }
    ];

    const columns = [
        { key: 'codigo_materia', label: 'Código' },
        { key: 'nombre', label: 'Materia' },
        { key: 'area', label: 'Área' },
        { key: 'horas_semanales', label: 'Horas/sem' },
        {
            key: 'acciones',
            label: 'Temas',
            render: (materia: any) => (
                <Link
                    // href={`/admin/cursos/${curso.id}/materias/${materia.id}/temas`}
                    href={cursos.materias.temas({
                      curso: curso.id,
                      materia: materia.id
                    })}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                >
                    <FileText size={18} /> Ver Temas
                </Link>
            )
        }
    ];

    return (
        <ContentLayout
            title={`Materias de ${curso.nombre}`}
            subtitle="Selecciona una materia para ver sus temas"
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Materias - ${curso.nombre}`} />
            <DataTable columns={columns} data={materias} />
        </ContentLayout>
    );
}