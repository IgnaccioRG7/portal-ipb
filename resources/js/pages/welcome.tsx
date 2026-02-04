import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { ArrowDown, CircleArrowDown, Facebook, GraduationCap, ChevronDownCircle, MoveRight } from 'lucide-react';
import Header from '@/components/header';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title='Inicio'>
                {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="preload" as="image" href="/hero.webp" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;600;700&family=Raleway:wght@400;500;600;900&display=swap"
                    rel="stylesheet"
                /> */}
            </Head>
            <div className="bg-gray-100 text-[#1b1b18] lg:justify-center dark:bg-gray-900">
                <Header isLanding />
                <main className="w-full font-body pb-1">
                    <section className="hero relative w-full h-screen max-h-250 z-40">
                        <div className="hero-image w-full h-full overflow-hidden absolute inset-0">
                            <img src="/hero.webp" alt="Hero Image" className='w-full h-full object-cover' loading="eager" fetchPriority="high" />
                            <div className='bg-black/70 absolute inset-0'></div>
                            {/* Gradiente radial de difuminado en la parte inferior */}
                            <div className='absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-[#f3f4f6] dark:from-[#101828] via-white/80 dark:via-gray-900/80 to-transparent pointer-events-none'></div>
                        </div>
                        <div className="z-60 relative h-full max-w-7xl mx-auto grid grid-cols-3 gap-4 px-0">
                            <div className="content grid col-span-3 md:col-span-2 px-4 items-center">
                                <div className="slogan flex flex-col gap-4 text-white dark:text-white text-start -translate-y-14">
                                    <p className='bg-[#fde047] rounded-md w-full max-w-137.5 px-4 text-[#143152] font-black text-sm md:text-lg'>Inscribete ahora</p>
                                    <h1 className='text-3xl md:text-5xl xl:text-6xl font-extrabold font-title'>
                                        Bienvenido a <span className='text-[#fde047]'>IPB</span> <br />
                                        <span className='text-[#ffffff] text-2xl md:text-3xl xl:text-4xl'>selecciona la meta que quieres</span>
                                    </h1>
                                    <p className='text-sm md:text-xl text-gray-200'>Preparate con los mejores para ingresar a la institucion de tus sueños</p>
                                    {/* <a
                                    href="#pricing-plans"
                                    className="group relative w-fit mx-auto isolate inline-flex items-center justify-center text-center font-semibold disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] rounded-lg overflow-hidden shadow-[0_1.5px_2px_0_rgba(0,0,0,0.32),0_0_0_1px_rgba(255,255,255,0.1),0_-1px_0_0_rgba(255,255,255,0.04)] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-blue-400 before:to-blue-600 before:opacity-100 hover:before:opacity-90 after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:opacity-0 hover:after:opacity-100 h-12 px-6 text-base text-white hover:shadow-[0_0_10px_rgba(96,186,255,0.18)]"
                                >
                                    Sé parte de la Academia
                                </a> */}
                                    <button className='bg-[#fde047] w-full md:mx-auto rounded-md md:px-4 py-2 text-[#143152] font-bold uppercase cursor-pointer hover:bg-[#fde047]/90 transition-all duration-300 text-sm md:text-xl px-2 max-w-full hover:scale-103 flex justify-center items-center transform-gpu will-change-transform flex-row gap-2'>
                                        Se parte de la Academia
                                        <MoveRight />
                                    </button>
                                </div>
                            </div>
                            <div className="relative hidden md:block h-150 my-auto -translate-y-14">

                                <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl floating-card" style={{ animationDelay: "0s" }}>
                                    <div className="text-6xl font-bold text-white mb-2">1,000</div>
                                    <p className="text-blue-200 text-sm font-medium">Estudiantes ingresados</p>
                                    {/* <p className="text-blue-300 text-xs">Ciclo 2025</p> */}
                                </div>


                                <div className="absolute top-32 right-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl" style={{ animationDelay: "0.2s" }}>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-4">Universidades</p>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="bg-white/20 px-4 py-2 rounded-lg text-white text-xs font-bold">UMSA</div>
                                        <div className="bg-white/20 px-4 py-2 rounded-lg text-white text-xs font-bold">UPEA</div>
                                        {/* <div className="bg-white/20 px-4 py-2 rounded-lg text-white text-xs font-bold">UAM</div> */}
                                    </div>
                                </div>


                                <div className="absolute bottom-32 left-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl " style={{ animationDelay: "0.4s" }}>
                                    <div className="text-5xl font-bold text-blue-300 mb-2">95%</div>
                                    <p className="text-blue-200 text-sm font-medium">Tasa de aprobación</p>
                                </div>


                                <div className="absolute bottom-0 right-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl floating-card-delay-3 max-w-xs" style={{ animationDelay: "0.6s" }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src="https://img.rocket.new/generatedImages/rocket_gen_img_1c74dab36-1769175876882.png" alt="Student testimonial" className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <p className="text-white text-sm font-bold">María Rojas</p>
                                            <p className="text-blue-300 text-xs">UMSA - Medicina</p>
                                        </div>
                                    </div>
                                    <p className="text-blue-100 text-sm italic">"Ingresé con 100 puntos gracias a IPB"</p>
                                </div>
                            </div>
                        </div>
                        <div className="icon-down absolute bottom-0 left-0 right-0 flex justify-center">
                            <ChevronDownCircle className='size-10 text-black/70 dark:text-white animate-bounce' />
                        </div>
                    </section>
                    <section className="courses my-20 flex flex-col gap-10">
                        <div className="title flex flex-col gap-2 text-gray-900 dark:text-white text-center">
                            <h2 className='font-title text-5xl font-bold'>Se parte de nuestros cursos</h2>
                            <p className=''>Ingresa a la institucion que quieras sin problema alguno</p>
                        </div>
                        <div className="bento text-black dark:text-white max-w-7xl mx-auto w-full px-2 xl:px-4 grid grid-cols-1 md:grid-cols-2 gap-4 grid-rows-[repeat(auto-fill, 200px)] md:grid-rows-[200px_500px_350px]">
                            <div className="universities md:col-span-2 rounded-md shadow-xs overflow-hidden relative">
                                <img src="/courses/universidades.webp" alt="Universidades imagen" className='w-full h-full object-cover object-bottom' />
                                <div className="back bg-linear-to-t from-black/80 from-25% via-35% to-50% to-transparent absolute inset-0 z-10"></div>
                                <div className="content absolute left-4 bottom-4 z-20 text-white">
                                    <h2 className='font-black text-xl'>Universidades</h2>
                                    <p className='text-sm text-gray-200'>Formacion para ingresar a universidades</p>
                                </div>
                            </div>
                            <div className="institutes rounded-md shadow-xs overflow-hidden relative">
                                <img src="/courses/institutos.webp" alt="Universidades imagen" className='w-full h-full object-cover object-bottom' />
                                <div className="back bg-linear-to-t from-black/80 from-15% via-35% to-50% to-transparent absolute inset-0 z-10"></div>
                                <div className="content absolute left-4 bottom-4 z-20 text-white">
                                    <h2 className='font-black text-xl'>Institutos</h2>
                                    <p className='text-sm text-gray-200'>Formacion para ingresar a universidades</p>
                                </div>
                            </div>
                            <div className="schools rounded-md shadow-xs overflow-hidden relative">
                                <img src="/courses/militarespoliciales.webp" alt="Universidades imagen" className='w-full h-full object-cover object-bottom' />
                                <div className="back bg-linear-to-t from-black/80 from-15% via-35% to-50% to-transparent absolute inset-0 z-10"></div>
                                <div className="content absolute left-4 bottom-4 z-20 text-white">
                                    <h2 className='font-black text-xl'>Instituciones militares y policiales</h2>
                                    <p className='text-sm text-gray-200'>Formacion para ingresar a universidades</p>
                                </div>
                            </div>
                            <div className="esfm md:col-span-2 rounded-md shadow-xs overflow-hidden relative">
                                <img src="/courses/esfm.webp" alt="Universidades imagen" className='w-full h-full object-cover object-cnter' />
                                <div className="back bg-linear-to-t from-black/80 from-15% via-35% to-50% to-transparent absolute inset-0 z-10"></div>
                                <div className="content absolute left-4 bottom-4 z-20 text-white">
                                    <h2 className='font-black text-xl'>ESFM - UAS</h2>
                                    <p className='text-sm text-gray-200'>Formacion para ingresar a universidades</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <footer className='mt-0 max-w-7xl mx-auto px-4 py-10 flex flex-col gap-3'>
                <h2 className='text-[#143152] font-black flex flex-row gap-2 items-center text-lg dark:text-[#2d64a3]'><GraduationCap className='size-8 dark:text-[#2d64a3]' />
                    Instituto Privado BOLIVIA</h2>
                <p className='text-gray-600 dark:text-gray-400'>Comprometidos con la excelencia educativa en Bolivia desde hace mas de 5 años, formando a los lideres de las mañanas</p>
                <div className="socials flex flex-row gap-3 items-center">
                    <div className="facebook bg-gray-200 text-gray-700 p-2 w-fit rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-facebook"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 2a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-3v1h3a1 1 0 0 1 .991 1.131l-.02 .112l-1 4a1 1 0 0 1 -.858 .75l-.113 .007h-2v6a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-6h-2a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 .883 -.993l.117 -.007h2v-1a6 6 0 0 1 5.775 -5.996l.225 -.004h3z" /></svg>
                    </div>
                    <div className="facebook bg-gray-200 text-gray-700 p-2 w-fit rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16.083 2h-4.083a1 1 0 0 0 -1 1v11.5a1.5 1.5 0 1 1 -2.519 -1.1l.12 -.1a1 1 0 0 0 .399 -.8v-4.326a1 1 0 0 0 -1.23 -.974a7.5 7.5 0 0 0 1.73 14.8l.243 -.005a7.5 7.5 0 0 0 7.257 -7.495v-2.7l.311 .153c1.122 .53 2.333 .868 3.59 .993a1 1 0 0 0 1.099 -.996v-4.033a1 1 0 0 0 -.834 -.986a5.005 5.005 0 0 1 -4.097 -4.096a1 1 0 0 0 -.986 -.835z" /></svg>
                    </div>
                    <div className="facebook bg-gray-200 text-gray-700 p-2 w-fit rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-whatsapp"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.497 4.409a10 10 0 0 1 -10.36 16.828l-.223 -.098l-4.759 .849l-.11 .011a1 1 0 0 1 -.11 0l-.102 -.013l-.108 -.024l-.105 -.037l-.099 -.047l-.093 -.058l-.014 -.011l-.012 -.007l-.086 -.073l-.077 -.08l-.067 -.088l-.056 -.094l-.034 -.07l-.04 -.108l-.028 -.128l-.012 -.102a1 1 0 0 1 0 -.125l.012 -.1l.024 -.11l.045 -.122l1.433 -3.304l-.009 -.014a10 10 0 0 1 1.549 -12.454l.215 -.203a10 10 0 0 1 13.226 -.217m-8.997 3.09a1.5 1.5 0 0 0 -1.5 1.5v1a6 6 0 0 0 6 6h1a1.5 1.5 0 0 0 0 -3h-1l-.144 .007a1.5 1.5 0 0 0 -1.128 .697l-.042 .074l-.022 -.007a4.01 4.01 0 0 1 -2.435 -2.435l-.008 -.023l.075 -.041a1.5 1.5 0 0 0 .704 -1.272v-1a1.5 1.5 0 0 0 -1.5 -1.5" /></svg>
                    </div>
                </div>
            </footer>
        </>
    );
}
