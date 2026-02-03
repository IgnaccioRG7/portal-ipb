import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PdfViewer from '@/Components/pdf-viewer';
import Header from '@/components/header';

export default function RecursosIndex({ recursos }) {
    const [selectedPdf, setSelectedPdf] = useState(null);

    /**
     * PROTECCIÓN 9: Bloquear teclas a nivel de página
     * Detecta combinaciones de teclas cuando el modal está abierto
     */
    useEffect(() => {
        if (!selectedPdf) return;

        const handleKeyDown = (e) => {
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

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // Chrome requiere esto
        };

        // Descomentar si quieres advertir al salir
        // window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [selectedPdf]);

    const openPdfViewer = (recurso) => {
        setSelectedPdf(recurso);
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
    };

    const closePdfViewer = () => {
        setSelectedPdf(null);
        // Restaurar scroll del body
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <Head title="Recursos Educativos" />

            <div className="bg-gray-100 text-[#1b1b18] lg:justify-center dark:bg-gray-900">
                <Header />

                <div className="min-h-screen pb-12 pt-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-gray-300">
                                Recursos Educativos
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Documentos y materiales de estudio disponibles
                            </p>
                        </div>

                        {/* Lista de recursos */}
                        {recursos.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500">
                                    No hay recursos disponibles en este momento
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {recursos.map((recurso) => (
                                    <div
                                        key={recurso.id}
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                                    >
                                        {/* Ícono PDF */}
                                        <div className="flex items-center mb-4">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-12 w-12 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {recurso.titulo}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {recurso.tamano_formateado}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Descripción */}
                                        {recurso.descripcion && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {recurso.descripcion}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="text-xs text-gray-500 mb-4">
                                            <p>Publicado por: {recurso.autor}</p>
                                            <p>Fecha: {recurso.fecha}</p>
                                        </div>

                                        {/* Botón para ver - SIN botón de descarga */}
                                        <button
                                            onClick={() => openPdfViewer(recurso)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>Ver Documento</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

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