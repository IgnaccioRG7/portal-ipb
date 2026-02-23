import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Edit, Plus, Eye, BarChart3 } from 'lucide-react';
import cursos from '@/routes/cursos';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

export default function MateriaTemas({ curso, modulo, materia, temas, modulo_materia_id }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cursos', href: cursos.index().url },
        { title: curso.nombre, href: cursos.modulos(curso.id).url },
        { title: modulo.nombre, href: cursos.materias({ curso: curso.id, modulo: modulo.id }).url },
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
                <span className={`px-2 py-1 rounded text-xs ${tema.estado === 'activo' ? 'bg-green-500 text-white' :
                    tema.estado === 'borrador' ? 'bg-yellow-500 text-white' : 'bg-gray-300'
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
                    href={cursos.temas.edit({
                        curso: curso.id,
                        modulo: modulo.id,
                        materia: materia.id,
                        tema: tema.id
                    })}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 dark:hover:text-blue-500"
                >
                    <Edit size={18} /> Editar
                </Link>
            )
        },
        {
            key: 'resultados',
            label: 'Resultados',
            render: (tema: any) => (
                <Link
                    href={cursos.temas.resultados({
                        curso: curso.id,
                        modulo: modulo.id,
                        materia: materia.id,
                        tema: tema.id
                    })}
                    className="text-green-600 hover:text-green-900 flex items-center gap-1"
                >
                    <BarChart3 size={18} /> Ver Resultados
                </Link>
            )
        }
    ];

    return (
        <ContentLayout
            title={`Temas de ${materia.nombre}`}
            subtitle={`Módulo: ${modulo.nombre} | Curso: ${curso.nombre}`}
            breadcrumbs={breadcrumbs}
            actions={<Link
                href={cursos.temas.create({
                    curso: curso.id,
                    modulo: modulo.id,
                    materia: materia.id
                })}
            >
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Tema
                </Button>
            </Link>}
        >
            <Head title={`Temas - ${materia.nombre}`} />

            <DataTable columns={columns} data={temas} />
        </ContentLayout>
    );
}