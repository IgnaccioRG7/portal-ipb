import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import ContentLayout from '@/layouts/content-layout';
import { Users, GraduationCap, FileEdit, ChartColumnIncreasing, ChartColumnDecreasing, Brain, UserPlus, CheckCircle

 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio Admin',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <ContentLayout
            breadcrumbs={breadcrumbs}
        >
            {/* Stats */}
            <section className="stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow px-6 py-4 dark:bg-gray-800 flex flex-col items-start gap-2">
                    <div className="icon w-full flex flex-row justify-between items-center gap-2">
                        <Users />
                        <div className="text-md font-bold text-gray-500 dark:text-gray-300">Total de estudiantes</div>
                    </div>
                    <div className="content w-full flex flex-row items-center justify-between gap-2">
                        <ChartColumnIncreasing className='text-green-600' />
                        <div className="text-2xl font-bold">{100}</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow px-6 py-4 dark:bg-gray-800 flex flex-col items-start gap-2">
                    <div className="icon w-full flex flex-row justify-between items-center gap-2">
                        <GraduationCap />
                        <div className="text-md font-bold text-gray-500 dark:text-gray-300">Cursos activos</div>
                    </div>
                    <div className="content w-full flex flex-row items-center justify-between gap-2">
                        <ChartColumnDecreasing className='text-yellow-600' />
                        <div className="text-2xl font-bold">{10}</div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow px-6 py-4 dark:bg-gray-800 flex flex-col items-start gap-2">
                    <div className="icon w-full flex flex-row justify-between items-center gap-2">
                        <FileEdit />
                        <div className="text-md font-bold text-gray-500 dark:text-gray-300">Examenes hoy</div>
                    </div>
                    <div className="content w-full flex flex-row items-center justify-between gap-2">
                        <Brain className='text-cyan-600' />
                        <div className="text-2xl font-bold">{5}</div>
                    </div>
                </div>
            </section>

            {/* Chart */}
            <section className="chart-section flex flex-col gap-4 mb-6">
                <h2 className='text-2xl font-bold'>Rendimiento Institucional</h2>
                <div className="chart w-full min-h-96 bg-gray-200 dark:bg-gray-800 rounded-md">

                </div>
            </section>

            {/* Current Actvities */}
            <section className="activities-section flex flex-col gap-4 mb-6">
                <h2 className='text-2xl font-bold'>Actividades recientes</h2>
                <div className="w-full h-auto rounded-md flex flex-col gap-4">
                    <div className="activity bg-white rounded-lg shadow px-4 py-4 dark:bg-gray-800 flex justify-between items-center">
                        <div className="flex flex-row gap-3 items-center">
                            <UserPlus className='size-10 p-2 dark:bg-blue-500/30 rounded-full text-white bg-blue-400' />
                            <div className="content flex flex-col items-start">
                                <div className="actvity-title text-normal font-bold ">Nuevo estudiante Inscrito</div>
                                <div className="actvity-description text-normal text-gray-500 dark:text-gray-300">{'Juan manuel lopez'}</div>
                            </div>
                        </div>
                        <div className="date">
                            Hace 5 minutos
                        </div>
                    </div>

                    <div className="activity bg-white rounded-lg shadow px-4 py-4 dark:bg-gray-800 flex justify-between items-center">
                        <div className="flex flex-row gap-3 items-center">
                            <CheckCircle className='size-10 p-2 dark:bg-green-500/30 rounded-full text-white bg-green-600' />
                            <div className="content flex flex-col items-start">
                                <div className="actvity-title text-normal font-bold ">Nuevo examen publicado</div>
                                <div className="actvity-description text-normal text-gray-500 dark:text-gray-300">{'Test Fsica - Inst. Militares'}</div>
                            </div>
                        </div>
                        <div className="date">
                            Hace 10 minutos
                        </div>
                    </div>
                </div>
            </section>


        </ContentLayout>
    );
}
