// resources/js/pages/Professor/Cursos/resultados-tema.tsx
import ContentLayout from '@/layouts/content-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import {
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Mail,
  Eye
} from 'lucide-react';
import { useState } from 'react';
import cursos from '@/routes/cursos';

interface Props {
  curso: {
    id: number;
    nombre: string;
    codigo_curso: string;
  };
  modulo: {
    id: number;
    nombre: string;
    codigo_modulo: string;
  };
  materia: {
    id: number;
    nombre: string;
    codigo_materia: string;
  };
  tema: {
    id: number;
    codigo_tema: string;
    nombre: string;
    total_preguntas: number;
  };
  estadisticas_generales: {
    total_estudiantes: number;
    total_intentos: number;
    promedio_general: number;
    nota_maxima: number;
    nota_minima: number;
    total_aprobados: number;
    total_reprobados: number;
  };
  estadisticas_estudiantes: Array<{
    estudiante_id: number;
    estudiante_nombre: string;
    estudiante_email: string;
    total_intentos: number;
    mejor_puntaje: number;
    mejor_fecha: string;
    ultimo_puntaje: number;
    ultima_fecha: string;
    promedio: number;
    aprobados: number;
    reprobados: number;
  }>;
  intentos: Array<{
    id: number;
    estudiante_nombre: string;
    intento_numero: number;
    fecha: string;
    tiempo: number;
    puntaje: number;
    porcentaje: number;
    estado: string;
  }>;
}

export default function ResultadosTemaProfesor({
  curso,
  modulo,
  materia,
  tema,
  estadisticas_generales,
  estadisticas_estudiantes,
  intentos
}: Props) {
  const [expandido, setExpandido] = useState<Record<number, boolean>>({});
  const [verDetalle, setVerDetalle] = useState<number | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: cursos.index().url },
    { title: curso.nombre, href: cursos.modulos(curso.id).url },
    { title: modulo.nombre, href: cursos.materias({ curso: curso.id, modulo: modulo.id }).url },
    { title: materia.nombre, href: cursos.temas({ curso: curso.id, modulo: modulo.id, materia: materia.id }).url },
    { title: `Resultados: ${tema.nombre || tema.codigo_tema}`, href: '#' },
  ];

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    // Ajuste para Bolivia (UTC-4)
    date.setHours(date.getHours() - 4);
    return date.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs.toString().padStart(2, '0')}`;
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const toggleEstudiante = (estudianteId: number) => {
    setExpandido(prev => ({
      ...prev,
      [estudianteId]: !prev[estudianteId]
    }));
  };

  const formatFechaLocal = (fecha: string) => {
    if (!fecha) return '';

    const date = new Date(fecha);

    return date.toLocaleString('es-BO', {
      timeZone: 'America/La_Paz',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title={`Resultados: ${tema.nombre || tema.codigo_tema}`}
      subtitle={`${materia.nombre} - ${modulo.nombre}`}
    >
      <Head title={`Resultados - ${tema.codigo_tema}`} />

      <div className="space-y-6">
        {/* Tarjetas de estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Estudiantes</p>
                <p className="text-3xl font-bold">{estadisticas_generales.total_estudiantes}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {estadisticas_generales.total_intentos} intentos totales
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Promedio</p>
                <p className="text-3xl font-bold">{estadisticas_generales.promedio_general}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Max: {estadisticas_generales.nota_maxima}% | Min: {estadisticas_generales.nota_minima}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aprobados</p>
                <p className="text-3xl font-bold text-green-600">{estadisticas_generales.total_aprobados}</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Reprobados: {estadisticas_generales.total_reprobados}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Preguntas</p>
                <p className="text-3xl font-bold">{tema.total_preguntas}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Total del examen</p>
          </div>
        </div>

        {/* Tabla de estudiantes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Rendimiento por Estudiante</h3>
            {/* Exportar a CSV */}
            {/* <button
              onClick={() => {}}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button> */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mejor Nota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Intento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {estadisticas_estudiantes.map((est, index) => (
                  <>
                    <tr
                      key={`${est.estudiante_id}-${index + (Math.floor(Math.random() * 10000))}-est'`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleEstudiante(est.estudiante_id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {est.estudiante_nombre}
                            </p>
                            <p className="text-xs text-gray-500">{est.estudiante_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {est.total_intentos} intentos
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorByPercentage(est.mejor_puntaje)}`}>
                          {est.mejor_puntaje}%
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFechaLocal(est.mejor_fecha)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorByPercentage(est.ultimo_puntaje)}`}>
                          {est.ultimo_puntaje}%
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFechaLocal(est.ultima_fecha)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold">
                          {est.promedio}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${est.estudiante_email}`;
                            }}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            title="Enviar correo"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setVerDetalle(est.estudiante_id);
                              // Aquí podrías redirigir a una vista detallada del estudiante
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button> */}
                          {expandido[est.estudiante_id] ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Fila expandible con intentos detallados */}
                    {expandido[est.estudiante_id] && (
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm mb-2">
                              Historial de intentos de {est.estudiante_nombre}
                            </h4>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-2 text-left">Intento</th>
                                  <th className="py-2 text-left">Fecha</th>
                                  <th className="py-2 text-left">Tiempo</th>
                                  <th className="py-2 text-left">Puntaje</th>
                                  <th className="py-2 text-left">Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {intentos
                                  .filter(i => i.estudiante_nombre === est.estudiante_nombre)
                                  .map((intento, index) => (
                                    <tr key={`${intento.id}-${index + (Math.floor(Math.random() * 10000))}-int`} className="border-b last:border-0">
                                      <td className="py-2">#{intento.intento_numero}</td>
                                      <td className="py-2">{formatFechaLocal(intento.fecha)}</td>
                                      <td className="py-2">{formatTiempo(intento.tiempo)}</td>
                                      <td className="py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getColorByPercentage(intento.porcentaje)}`}>
                                          {intento.porcentaje}%
                                        </span>
                                      </td>
                                      <td className="py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${intento.porcentaje >= 70
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                          }`}>
                                          {intento.porcentaje >= 70 ? 'Aprobado' : 'Reprobado'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón de volver */}
        <div className="flex justify-end">
          <Link
            href={cursos.temas({
              curso: curso.id,
              modulo: modulo.id,
              materia: materia.id
            }).url}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
          >
            Volver a Temas
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}