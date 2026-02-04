import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import PdfViewer from '@/components/pdf-viewer';
import Header from '@/components/header';
import { Input } from '@/components/ui/input';
import { FileText, Search } from 'lucide-react';

interface Tab {
    categoria: string,
    nombre: string
}

interface Resource {
    autor: string,
    descripcion: string,
    fecha: Date,
    id: number,
    nombre_original: string,
    tamano_formateado: string,
    titulo: string,
    url: string
}

interface Category {
    categoria: string,
    nombre: string,
    recursos: Resource[]
}

interface Props {
    recursos: Category[]
}

export default function RecursosIndex({ recursos }: Props) {
    const [selectedPdf, setSelectedPdf] = useState<Resource | null>(null);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('')
    const [search, setSearch] = useState<string>('')

    // console.log(recursos);


    /**
     * PROTECCIÓN 9: Bloquear teclas a nivel de página
     * Detecta combinaciones de teclas cuando el modal está abierto
     */
    useEffect(() => {
        if (!selectedPdf) return;

        const handleKeyDown = (e: any) => {
            // Bloquear Escape para cerrar (opcional, puedes permitirlo)
            if (e.key === 'Escape') {
                closePdfViewer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedPdf]);

    /**
     * PROTECCIÓN 10: Prevenir que el usuario salga por accidente
     * (opcional, puede ser molesto)
     */
    useEffect(() => {
        if (!selectedPdf) return;

        const handleBeforeUnload = (e: any) => {
            e.preventDefault();
            e.returnValue = ''; // Chrome requiere esto
        };

        // Descomentar si quieres advertir al salir
        // window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [selectedPdf]);

    const openPdfViewer = (recurso: Resource) => {
        setSelectedPdf(recurso);
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
    };

    const closePdfViewer = () => {
        setSelectedPdf(null);
        // Restaurar scroll del body
        document.body.style.overflow = 'unset';
    };

    const recursosFiltrados = selectedTab === 'todos'
        ? recursos
        : recursos?.filter(recurso => {
            return recurso.categoria === selectedTab
        })

    // console.log(recursosFiltrados);

    const recursosBuscados = useMemo(() => {
        if (search.trim() === '') {
            return recursosFiltrados;
        }

        const terminoBusqueda = search.toLowerCase().trim();

        return recursosFiltrados
            .map(categoria => ({
                ...categoria,
                recursos: categoria.recursos.filter(recurso =>
                    recurso.titulo.toLowerCase().includes(terminoBusqueda) ||
                    (recurso.descripcion && recurso.descripcion.toLowerCase().includes(terminoBusqueda))
                )
            }))
            .filter(categoria => categoria.recursos.length > 0);
    }, [recursosFiltrados, search]);


    useEffect(() => {
        const categories = recursos.map(recurso => {
            return {
                categoria: recurso.categoria,
                nombre: recurso.nombre
            }
        })

        if (categories.length > 0) {
            setSelectedTab('todos')
            setTabs([{
                categoria: 'todos',
                nombre: 'Todos'
            },
            ...categories])
        }
    }, [recursos])

    const imagesUrls = {
        medicina: '/resources/medicina.webp',
        ingenieria: '/resources/ingenieria.webp',
        militares: '/resources/militares.webp',
        policias: '/resources/policias.webp',
        otro: '/resources/otro.webp',
    }

    const colors = {
        medicina: 'bg-green-600',
        ingenieria: 'bg-yellow-600',
        militares: 'bg-blue-600',
        policias: 'bg-cyan-600',
        otro: 'bg-gray-600',
    }

    return (
        <>
            <Head title="Recursos Educativos" />

            <div className="bg-gray-100 text-[#1b1b18] lg:justify-center dark:bg-gray-900">
                <Header />

                <div className="min-h-screen pb-12 pt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-2 flex flex-col gap-4">
                        {/* Header */}
                        <div className="">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-gray-300 font-title">
                                Recursos Educativos
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Documentos y materiales de estudio disponibles
                            </p>
                        </div>

                        {/* Buscador y filtrado de recursos */}
                        <search className='bg-white rounded-md dark:bg-transparent dark:border dark:border-gray-500'>
                            <label htmlFor="search-resource" className='flex flex-row gap-2 items-center px-2 py-1'>
                                <Search className='dark:text-gray-300' />
                                <Input
                                    id='search-resource'
                                    type='search'
                                    placeholder='Busca guias, libros o cualquier material de ayuda para ti....'
                                    className='border-none px-0 pr-4 focus:outline-none! focus:border-none! ring-0! shadow-none dark:text-white'
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value) }}
                                />
                            </label>
                        </search>

                        {/* Menu tabbar para seleccionar los recursos */}
                        <section className="tab-bar w-full">
                            <nav className='flex flex-row flex-wrap'>
                                {
                                    tabs.map((tab, index) => {
                                        const isActive = tab.categoria === selectedTab
                                        return (
                                            <button key={`${index}-${tab}`} className={`py-2 px-4 font-black border-b-6 cursor-pointer ${isActive ? 'border-yellow-500 text-black dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}
                                                onClick={() => { setSelectedTab(tab.categoria) }}
                                            >
                                                {tab.nombre}
                                            </button>
                                        )
                                    })
                                }
                            </nav>
                        </section>

                        {/* Lista de recursos */}
                        {
                            recursosBuscados.length === 0
                                ? (<div className="bg-white rounded-lg shadow p-8 text-center">
                                    <p className="text-gray-500">
                                        No existen recursos en este momento
                                    </p>
                                </div>)
                                : (<section className="resources flex flex-col gap-4">
                                    {
                                        recursosBuscados.map((grupo, index) => {
                                            return (
                                                <div key={`${index}-${grupo.categoria}`}>
                                                    <h2 className='text-xl md:text-2xl font-bold mb-4 dark:text-gray-100'>Guia de estudio {grupo.nombre} ({grupo.recursos.length})</h2>
                                                    {/* Recursos de esta categoría */}
                                                    {grupo.recursos.length === 0 ? (
                                                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                                                            <p className="text-gray-500">
                                                                No hay recursos en esta categoría
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                                            {grupo.recursos.map((recurso: any) => (
                                                                <div
                                                                    key={recurso.id}
                                                                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                                                                >
                                                                    {/* Ícono PDF */}
                                                                    <div className="icono px-6 py-8 relative overflow-hidden">
                                                                        <span className={`absolute z-20 top-4 left-4 px-2 py-1 rounded-full uppercase text-xs font-black text-white ${colors[grupo.categoria as keyof typeof colors]}`}>
                                                                            {grupo.categoria}
                                                                        </span>
                                                                        <div className="absolute inset-0">
                                                                            <img
                                                                                src={imagesUrls[grupo.categoria as keyof typeof imagesUrls] || imagesUrls.otro}
                                                                                alt={`Imagen para ${grupo.nombre}`}
                                                                                className='w-full h-full object-cover'
                                                                            />
                                                                            {/* Overlay oscuro */}
                                                                            <div className="absolute inset-0 bg-black/40"></div>
                                                                        </div>

                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-type-pdf p-2 bg-white dark:bg-gray-800 rounded-md mx-auto text-red-700 relative">
                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                            <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                                                            <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
                                                                            <path d="M17 18h2" />
                                                                            <path d="M20 15h-3v6" />
                                                                            <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
                                                                        </svg>
                                                                    </div>

                                                                    <div className="content px-4 pt-2 pb-4">
                                                                        <div className='flex gap-2 justify-between items-center'>
                                                                            <div>
                                                                                {/* Titulo */}
                                                                                <div className="">
                                                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                                        {recurso.titulo}
                                                                                    </h3>
                                                                                    {/* <p className="text-sm text-gray-500">
                                                                        {recurso.tamano_formateado}
                                                                    </p> */}
                                                                                </div>
                                                                                {/* Descripción */}
                                                                                {recurso.descripcion && (
                                                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                                                                        {recurso.descripcion}
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Metadata */}
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                                                {/* <p>Publicado por: {recurso.autor}</p>
                                                                        <p>Fecha: {recurso.fecha}</p> */}
                                                                                <p className='text-end'>Publicado en fecha: <br /> {recurso.fecha}</p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Botón para ver */}
                                                                        <button
                                                                            onClick={() => openPdfViewer(recurso)}
                                                                            className="w-full bg-[#113081] hover:bg-[#153ea7] text-white px-4 py-2 rounded text-sm font-medium transition flex items-center justify-center space-x-2 cursor-pointer"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                            <span>Ver Documento</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    }
                                </section>)
                        }

                        {/* Link para volver */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/"
                                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Volver al inicio</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/**
             * ==================== MODAL DEL VISOR PDF ====================
             * 
             * Se muestra cuando selectedPdf tiene un valor
             * Ocupa toda la pantalla (fixed inset-0)
             * z-50 para estar encima de todo
             */}
                {selectedPdf && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        {/**
                     * BACKDROP
                     * Fondo oscuro semi-transparente
                     * onClick cierra el modal al hacer clic fuera
                     */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-90 transition-opacity"
                            onClick={closePdfViewer}
                        />

                        {/**
                     * CONTENEDOR DEL MODAL
                     * relative para posicionar elementos internos
                     * h-full para ocupar toda la altura
                     */}
                        <div className="relative h-full flex flex-col">
                            {/**
                         * BOTÓN CERRAR
                         * Posición absoluta en la esquina superior derecha
                         * z-50 para estar encima del visor
                         */}
                            <button
                                onClick={closePdfViewer}
                                className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                                title="Cerrar visor"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/**
                         * COMPONENTE VISOR
                         * flex-1 para ocupar todo el espacio disponible
                         * overflow-hidden para que el scroll lo maneje el componente
                         */}
                            <div className="flex-1 overflow-hidden">
                                <PdfViewer
                                    url={selectedPdf.url}
                                    titulo={selectedPdf.titulo}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}