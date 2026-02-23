// resources/js/pages/Student/resultados.tsx
import ContentLayout from '@/layouts/content-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { ArrowLeftToLine, Trophy, Clock, RotateCcw, Home, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import estudiante from '@/routes/estudiante';
import { useQuizStore } from '@/store/quiz';
import { useEffect } from 'react';
import { Alert } from '@/components/ui/alert';

interface Props {
  curso: {
    id: number;
    nombre: string;
  };
  modulo: {
    id: number;
    nombre: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
  tema: {
    id: number;
    nombre: string;
    contenido_json: string;
  };
  ultimo_intento: {
    respuestas: Record<string, any>;
    porcentaje: number;
    tiempo: number;
    fecha: string;
  } | null;
  intentos: Array<{
    id: number;
    intento_numero: number;
    fecha: string;
    tiempo: number;
    puntaje: number;
    porcentaje: number;
    estado: string;
  }>;
}

export default function Resultados({
  curso,
  modulo,
  materia,
  tema,
  ultimo_intento,
  intentos
}: Props) {
  const { reset } = useQuizStore();

  // Limpiar el store al cargar la página
  useEffect(() => {
    reset();
  }, []);

  const contenido = tema.contenido_json ? JSON.parse(tema.contenido_json) : { questions: [] };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: estudiante.dashboard().url },
    { title: 'Materias', href: estudiante.subjects(curso.id).url },
    {
      title: 'Temas', href: estudiante.topics({
        curso: curso.id,
        modulo: modulo.id,
        materia: materia.id
      }).url
    },
    { title: 'Resultados', href: '#' },
  ];

  const reintentar = () => {
    router.visit(estudiante.topic({
      curso: curso.id,
      modulo: modulo.id,
      materia: materia.id,
      tema: tema.id
    }).url);
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100 border-green-300';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const formatTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs.toString().padStart(2, '0')}`;
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
    <ContentLayout breadcrumbs={breadcrumbs} title={`Resultados: ${tema.nombre || materia.nombre}`}>
      <Head title="Resultados del Examen" />

      <div className="space-y-6">
        {/* Tarjeta del último intento */}
        {ultimo_intento && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${getColorByPercentage(ultimo_intento.porcentaje)}`}>
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Último Intento</h3>
                  <p className="text-gray-500">{formatFechaLocal(ultimo_intento.fecha)}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Puntaje</p>
                  <p className="text-3xl font-bold">{ultimo_intento.porcentaje}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Tiempo</p>
                  <p className="text-xl font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTiempo(ultimo_intento.tiempo)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={reintentar}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar Examen
          </button>
          <Link
            href={estudiante.dashboard().url}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
        </div>

        {/* Historial de intentos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historial de Intentos
          </h3>

          {intentos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay intentos anteriores</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Intento</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Tiempo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Puntaje</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {intentos.map((intento) => (
                    <tr key={intento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 font-medium">#{intento.intento_numero}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatFechaLocal(intento.fecha)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatTiempo(intento.tiempo)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorByPercentage(intento.porcentaje)}`}>
                          {intento.porcentaje}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {intento.porcentaje >= 70 ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" /> Aprobado
                          </span>
                        ) : intento.porcentaje >= 50 ? (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="w-4 h-4" /> Mejoralo
                          </span>
                        )
                          : <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" /> Reintentar
                          </span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}