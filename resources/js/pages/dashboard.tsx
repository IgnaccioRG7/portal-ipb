import { Head, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import ContentLayout from '@/layouts/content-layout';
import { BookOpen, PlayCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import estudiante from "@/routes/estudiante"
import { useState } from 'react';

export interface Tema {
    id: number;
    nombre: string;
}

export interface MateriaModulo {
    modulo_materia_id: number;
    materia_id: number;
    materia_nombre: string;
    materia_descripcion: string;
    orden: number;
    temas_count: number;
}

export interface Modulo {
    modulo_id: number;
    codigo_modulo: string;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    materias: MateriaModulo[];
}

export interface Curso {
    id: number;
    codigo_curso?: string;
    nombre: string;
    descripcion?: string;
}

export interface MatriculaCurso {
    matricula_id: number;
    codigo_matricula: string;
    curso: Curso;
    modulos: Modulo[];
}

interface Props {
    matriculas: MatriculaCurso[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: dashboard().url,
    },
];

function CourseCard({ data }: { data: MatriculaCurso }) {
    const [moduloExpandido, setModuloExpandido] = useState<number | null>(null);

    const toggleModulo = (moduloId: number) => {
        setModuloExpandido(prev => prev === moduloId ? null : moduloId);
    };

    const goToSubjects = () => {
        router.visit(
            estudiante.subjects({
                course: data.curso.id
            })
        );
    };

    const totalMaterias = data.modulos.reduce((total, modulo) => total + modulo.materias.length, 0);
    const totalTemas = data.modulos.reduce((total, modulo) => {
        return total + modulo.materias.reduce((subTotal, materia) => subTotal + materia.temas_count, 0);
    }, 0);

    return (
        <div className="relative rounded-xl border bg-white px-4 pb-4 shadow-sm dark:bg-gray-800">
            <h2 className="absolute -top-3 left-4 bg-white px-3 text-2xl font-bold text-gray-800 cursor-pointer dark:bg-gray-800 dark:text-gray-300 rounded-md">
                {data.curso.nombre}
            </h2>

            {/* Resumen del curso */}
            <div className="mt-8 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Módulos</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {data.modulos.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Materias</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {totalMaterias}
                            </p>
                        </div>
                    </div>
                </div>
                {/* TODO: ARREGLAR ESTE VALOR EN LA CONSULTA O QUITARLO DEFINITIVAMENTE. esta mostrando temas totales en el dashboard */}
                {/* <div className="rounded-lg bg-purple-50 p-4 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Temas totales</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {totalTemas}
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Lista de módulos */}
            <div className="space-y-4">
                {data.modulos.map((modulo) => (
                    <div key={modulo.modulo_id} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Encabezado del módulo */}
                        <button
                            onClick={() => toggleModulo(modulo.modulo_id)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-start">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                                        {modulo.nombre}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(modulo.fecha_inicio).toLocaleDateString()} - {new Date(modulo.fecha_fin).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {modulo.materias.length} materia(s)
                                </span>
                                {moduloExpandido === modulo.modulo_id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                        </button>

                        {/* Materias del módulo (expandible) */}
                        {moduloExpandido === modulo.modulo_id && (
                            <div className="p-4 bg-white dark:bg-gray-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {modulo.materias.map((materia) => (
                                        <MateriaCard key={`${modulo.modulo_id}-${materia.materia_id}`} materia={materia} modulo={modulo} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className='flex justify-end mt-6'>
                <button 
                    className="flex px-6 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-600/80 cursor-pointer"
                    onClick={goToSubjects}
                >
                    Continuar aprendizaje
                    <PlayCircle className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

function MateriaCard({ materia, modulo }: { materia: MateriaModulo, modulo: Modulo }) {
    return (
        <article className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md dark:border dark:border-gray-500 flex flex-col">
            <div className="p-4 flex flex-col grow">
                <header className="mb-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                {materia.materia_nombre}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {modulo.nombre}
                            </p>
                        </div>
                        <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                            Activo
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {materia.materia_descripcion}
                    </p>
                </header>

                <div className="mt-auto">
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-gray-700">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <div className="text-sm flex items-center gap-2">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{materia.temas_count}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Tema(s)</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function Dashboard({ matriculas }: Props) {
    console.log(matriculas);
    
    const totalCursos = matriculas?.length || 0;
    const totalMaterias = matriculas?.reduce((total, matricula) => {
        return total + matricula.modulos.reduce((subTotal, modulo) => subTotal + modulo.materias.length, 0);
    }, 0) || 0;

    return (
        // TODOHOY colocar el nombre del estudiantes aqui
        <ContentLayout
            breadcrumbs={breadcrumbs}
            title='Bienvenido!'
            subtitle={`Estas inscrito en ${totalCursos} curso(s) con ${totalMaterias} materia(s) activas actualmente.`}
        >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                <section className="lg:col-span-9 space-y-6">
                    {matriculas?.map((item) => (
                        <CourseCard key={item.matricula_id} data={item} />
                    ))}
                </section>

                <aside className="lg:col-span-3 bg-gray-50 p-4 rounded-xl h-fit dark:bg-gray-800">
                    <h2 className="font-bold text-xl mb-4">Novedades</h2>
                    <ul className="text-sm text-gray-600 grid gap-2">
                        <li className='flex gap-4 items-center'>
                            <span className='font-black p-2 flex justify-center items-center bg-amber-200 rounded-md size-14'>HOY</span>
                            <p className='dark:text-gray-400'>
                                <span className='text-black font-black dark:text-gray-100'>Examen Fisica</span>
                                <br />
                                Hasta las 12:00 PM
                            </p>
                        </li>
                        <li className='flex gap-4 items-center'>
                            <span className='font-black p-2 bg-blue-200 rounded-md text-center size-14'>
                                <span className='text-xs'>FEB</span>
                                <br /> 23
                            </span>
                            <p className='dark:text-gray-400'>
                                <span className='text-black font-black dark:text-gray-100'>Examen Fisica</span>
                                <br />
                                Hasta las 12:00 PM
                            </p>
                        </li>
                    </ul>
                </aside>
            </div>
        </ContentLayout>
    );
}