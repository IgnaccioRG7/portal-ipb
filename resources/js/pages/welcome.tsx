import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title='Inicio'>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

                <link
                    href="https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;600;700&family=Raleway:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="bg-[#FDFDFC] text-[#1b1b18] lg:justify-center dark:bg-gray-900">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden lg:max-w-7xl mx-auto flex justify-between gap-2 px-6 py-2 lg:px-8 absolute z-10 left-0 right-0">
                    <Link
                        href={'/'}
                    >
                        <img src='/logo.png' alt='logo IPB' className='w-12' />
                    </Link>
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Ir al inicio
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-white font-bold hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Inicia sesion
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="w-full font-body">
                    <section className="hero relative w-full h-screen max-h-250">
                        <div className="hero-image w-full h-full overflow-hidden absolute inset-0">
                            <img src="/hero.jpg" alt="Hero Image" className='w-full h-full object-cover' />
                            <div className='bg-black/50 absolute inset-0'></div>
                            {/* Gradiente radial de difuminado en la parte inferior */}
                            <div className='absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-white dark:from-[#101828] via-white/80 dark:via-gray-900/80 to-transparent pointer-events-none'></div>
                        </div>
                        <div className="content absolute inset-0 grid place-content-center">
                            <div className="slogan flex flex-col gap-4 text-white dark:text-white text-center -translate-y-20">
                                <h1 className='text-6xl font-extrabold font-title'>
                                    Bienvenido a <span className='text-yellow-300'>IPB</span> <br />
                                    <span className='text-gray-400'>selecciona la meta que quieres</span>
                                </h1>
                                <p className='text-2xl text-gray-300'>Preparate con los mejores para ingresar a la institucion de tus sueños</p>
                                <a
                                    href="#pricing-plans"
                                    className="group relative w-fit mx-auto isolate inline-flex items-center justify-center text-center font-semibold disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] rounded-lg overflow-hidden shadow-[0_1.5px_2px_0_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,255,255,0.1),0_-1px_0_0_rgba(255,255,255,0.04)] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-blue-400 before:to-blue-600 before:opacity-100 hover:before:opacity-90 after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:opacity-0 hover:after:opacity-100 h-12 px-6 text-base text-white hover:shadow-[0_0_10px_rgba(96,186,255,0.18)]"
                                >
                                    Sé parte de la Academia
                                </a>
                            </div>
                        </div>
                    </section>
                    <section className="courses my-20 flex flex-col gap-10">
                        <div className="title flex flex-col gap-2 text-gray-900 dark:text-white text-center">
                            <h2 className='font-title text-4xl font-bold'>Se parte de nuestros cursos</h2>
                            <p className=''>Ingresa a la institucion que quieras sin problema alguno</p>
                        </div>
                        <div className="bento text-black dark:text-white max-w-7xl mx-auto w-full px-2 xl:px-4 grid grid-cols-2 gap-4">
                            <div className="universities col-span-2 p-4 border border-gray-200 rounded-md shadow-xs">
                                <h2>Universidades</h2>
                            </div>
                            <div className="institutes p-4 border border-gray-200 rounded-md shadow-xs">
                                <h2>Institutos</h2>
                            </div>
                            <div className="schools p-4 border border-gray-200 rounded-md shadow-xs">
                                <h2>Instituciones militares y policiales</h2>
                            </div>
                        </div>
                    </section>
                </main>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
