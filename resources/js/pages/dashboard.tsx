import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import ContentLayout from '@/layouts/content-layout';
import { PlayCircle } from 'lucide-react';

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
    return (
        <div className="relative rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="absolute -top-3 left-4 bg-white px-3 text-lg font-bold text-gray-800">
                {data.curso.nombre}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data.materias.map((materia) => (
                    <MateriaCard key={materia.id} materia={materia} />
                ))}
            </div>
        </div>
    );
}


function MateriaCard({ materia }: { materia: any }) {
    return (
        <article className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md">
            <img
                src="/hero.jpg"
                alt="Imagen del curso"
                className="aspect-video w-full object-cover"
            />

            <div className="p-4">
                <header className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                        {materia.nombre}
                    </h3>

                    <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                        Activo
                    </span>
                </header>

                <ul className="space-y-2">
                    {materia.temas.map((tema: any) => (
                        <li
                            key={tema.id}
                            className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                        >
                            <span className="font-medium text-gray-700">
                                {tema.nombre}
                            </span>

                            <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                <PlayCircle size={16} />
                                Entrar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <footer className="px-4 pb-4">
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-600/80">
                    Continuar aprendizaje
                    <PlayCircle />
                </button>
            </footer>
        </article>
    );
}


export default function Dashboard({ matriculas }: Props) {

    console.log(matriculas);


    return (
        <ContentLayout
            breadcrumbs={breadcrumbs}
            title='Bienvenido Juan!'
            subtitle='Estas inscrito en 1 curso con 2 materias en progreso'
        >
            {/* <section className="json">
                { JSON.stringify(matriculas, null , 2) }
            </section> */}
            {/* <section className="courses-section">
                <div className="course-card border px-4 py-6 rounded-md relative">
                    <h2 className='font-bold text-normal text-gray-800 absolute top-0 -translate-y-1/2 bg-white px-2'>ESFM - UAS</h2>
                    <div className="topic-section grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <article className="topic-card math rounded-md overflow-hidden shadow-xs border border-gray-300">
                            <img src="/hero.jpg" alt="Imagen del curso" className='w-full h-auto object-cover aspect-video' />
                            <div className="content px-4 py-2">
                                <header className='flex flex-row gap-2 items-center justify-between'>
                                    <h2 className='text-xl font-bold'>Compresion Lectora</h2>
                                    <div className="badge text-xs text-white font-bold bg-green-600 px-2 py-1 rounded-full">
                                        Activo
                                    </div>
                                </header>
                            </div>
                            <footer className='px-4 mb-4'>
                                <button className='w-full bg-[#0099ff] text-white text-normal font-black p-2 rounded-full cursor-pointer flex flex-row justify-center items-center gap-2 hover:bg-[#0099ff]/80 transition-colors duration-300'>
                                    Continuar aprendiendo
                                    <PlayCircle />
                                </button>
                            </footer>
                        </article>
                        <article className="topic-card math rounded-md overflow-hidden shadow-xs border border-gray-300">
                            <img src="/hero.jpg" alt="Imagen del curso" className='w-full h-auto object-cover aspect-video' />
                            <div className="content px-4 py-2">
                                <header className='flex flex-row gap-2 items-center justify-between'>
                                    <h2 className='text-xl font-bold'>Razonamiento</h2>
                                    <div className="badge text-xs text-white font-bold bg-green-600 px-2 py-1 rounded-full">
                                        Activo
                                    </div>
                                </header>
                            </div>
                            <footer className='px-4 mb-4'>
                                <button className='w-full bg-[#0099ff] text-white text-normal font-black p-2 rounded-full cursor-pointer flex flex-row justify-center items-center gap-2 hover:bg-[#0099ff]/80 transition-colors duration-300'>
                                    Continuar aprendiendo
                                    <PlayCircle />
                                </button>
                            </footer>
                        </article>
                    </div>
                </div>
            </section> */}

            <div className="container grid grid-cols-[1fr,500px] gap-4">
                <section className="space-y-5">
                    {matriculas.map((item) => (
                        <CourseCard key={item.curso.id} data={item} />
                    ))}
                </section>
                <aside>
                    <h2>Novedades</h2>
                </aside>
            </div>

        </ContentLayout>
    );
}
