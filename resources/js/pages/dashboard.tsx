import { Head, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import ContentLayout from '@/layouts/content-layout';
import { BookOpen, PlayCircle } from 'lucide-react';
import estudiante from "@/routes/estudiante"

export interface Tema {
    id: number;
    nombre: string;
}

export interface Materia {
    id: number;
    nombre: string;
    temas: Tema[];
}


export interface Curso {
    id: number;
    nombre: string;
}

export interface MatriculaCurso {
    curso: Curso;
    materias: Materia[];
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
    const goToSubjects = () => {
        console.log(data);
        router.visit(
            // estudiante.subjects(materia.id).url
            estudiante.subjects({
                course: data.curso.id
            })
        );
    }
    return (
        <div className="relative rounded-xl border bg-white px-4 pb-4 shadow-sm dark:bg-gray-800">
            <h2 className="absolute -top-3 left-4 bg-white px-3 text-2xl font-bold text-gray-800 cursor-pointer dark:bg-gray-800 dark:text-gray-300 rounded-md">
                {data.curso.nombre}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data.materias.map((materia) => (
                    <MateriaCard key={materia.id} materia={materia} />
                ))}
            </div>
            <div className='flex justify-end'>
                <button className="mt-4 flex w-full max-w-full md:max-w-1/2 px-6 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-600/80 cursor-pointer" onClick={goToSubjects}>
                    Continuar aprendizaje
                    <PlayCircle />
                </button>
            </div>
        </div>
    );
}


function MateriaCard({ materia }: { materia: any }) {

    return (
        <article className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md pb-4 dark:border dark:border-gray-500 flex flex-col">
            <img
                src="/hero.jpg"
                alt="Imagen del curso"
                className="aspect-video w-full object-cover"
            />

            <div className="pt-4 px-4 flex flex-col grow">
                <header className="mb-3 flex items-center justify-between grow">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {materia.nombre}
                    </h3>

                    <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                        Activo
                    </span>
                </header>

                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-gray-700">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <div className="text-sm flex items-center gap-2">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{materia.temas}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">Tema(s) disponibles</p>
                    </div>
                </div>
            </div>
        </article>
    );
}


export default function Dashboard({ matriculas }: Props) {
    console.log(matriculas);

    return (
        <ContentLayout
            breadcrumbs={breadcrumbs}
            title='Bienvenido Juan!'
            subtitle={`Estas inscrito en ${matriculas?.length} curso(s) actualmente.`}
        >

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                <section className="lg:col-span-9 space-y-6">
                    {matriculas?.map((item) => (
                        <CourseCard key={item.curso.id} data={item} />
                    ))}
                </section>

                <aside className="lg:col-span-3 bg-gray-50 p-4 rounded-xl h-fit dark:bg-gray-800">
                    <h2 className="font-bold text-xl mb-4">Novedades</h2>
                    <ul className="text-sm text-gray-600 grid gap-2">
                        <li className='flex gap-4 items-center'>
                            <span className='font-black p-2 flex justify-center items-center bg-amber-200 rounded-md size-14'>HOY</span>
                            <p className='dark:text-gray-400'><span className='text-black font-black dark:text-gray-100'>Examen Fisica</span>  <br />
                                Hasta las 12:00 PM</p>
                        </li>
                        <li className='flex gap-4 items-center'>
                            <span className='font-black p-2 bg-blue-200 rounded-md text-center size-14'>
                                <span className='text-xs'>FEB</span>
                                <br /> 23</span>
                            <p className='dark:text-gray-400'><span className='text-black font-black dark:text-gray-100'>Examen Fisica</span>  <br />
                                Hasta las 12:00 PM</p>
                        </li>
                    </ul>
                </aside>

            </div>

        </ContentLayout>
    );
}
