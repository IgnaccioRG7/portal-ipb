// resources/js/pages/Admin/Matriculas/estudiante.tsx
import ContentLayout from '@/layouts/content-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';
import { Calendar, BookOpen, CheckCircle, XCircle, PlusCircle } from 'lucide-react';

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface Curso {
  id: number;
  nombre: string;
  codigo_curso: string;
  nivel: string;
}

interface Matricula {
  id: number;
  curso: string;
  codigo_curso: string;
  estado: string;
  id_curso: number,
  fecha_finalizacion: string | null;
  fecha_matricula: string;
}

export default function MatriculaEstudiante({
  estudiante,
  cursos,
  matriculas_actuales
}: {
  estudiante: Estudiante;
  cursos: Curso[];
  matriculas_actuales: Matricula[];
}) {

  console.log(matriculas_actuales);
  

  const { data, setData, post, processing, errors, reset } = useForm<{
    curso_id: string;
    fecha_finalizacion: string;
    observaciones: string;
  }>({
    curso_id: '',
    fecha_finalizacion: '',
    observaciones: '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: admin.users.index().url },
    { title: estudiante.nombre, href: '#' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // post(route('admin.matriculas.matricular', estudiante.id));
    post(admin.matriculas.matricular({
      user: estudiante.id
    }).url);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'finalizado': return 'bg-blue-100 text-blue-800';
      case 'retirado': return 'bg-yellow-100 text-yellow-800';
      case 'suspendido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ContentLayout
      title={`Matricular Estudiante: ${estudiante.nombre}`}
      subtitle={`Email: ${estudiante.email}`}
      breadcrumbs={breadcrumbs}
    >
      <Head title={`Matricular - ${estudiante.nombre}`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de matrícula */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-green-600" />
              Nueva Matrícula
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de curso */}
              <div>
                <Label htmlFor="curso_id" className="mb-2 block">
                  Seleccionar Curso *
                </Label>
                <select
                  id="curso_id"
                  value={data.curso_id}
                  onChange={(e) => setData('curso_id', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="">Selecciona un curso</option>
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre} - {curso.codigo_curso} ({curso.nivel})
                    </option>
                  ))}
                </select>
                <InputError message={errors.curso_id} />
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona el curso al que deseas matricular al estudiante
                </p>
              </div>

              {/* Fecha de finalización */}
              <div>
                <Label htmlFor="fecha_finalizacion" className="mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Finalización (Opcional)
                </Label>
                <Input
                  type="date"
                  id="fecha_finalizacion"
                  value={data.fecha_finalizacion}
                  onChange={(e) => setData('fecha_finalizacion', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <InputError message={errors.fecha_finalizacion} />
                <p className="text-xs text-gray-500 mt-1">
                  Si no se especifica, la matrícula será indefinida
                </p>
              </div>

              {/* Observaciones */}
              <div>
                <Label htmlFor="observaciones" className="mb-2 block">
                  Observaciones
                </Label>
                <Textarea
                  id="observaciones"
                  value={data.observaciones}
                  onChange={(e) => setData('observaciones', e.target.value)}
                  rows={3}
                  placeholder="Notas adicionales sobre esta matrícula..."
                />
                <InputError message={errors.observaciones} />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={processing || !data.curso_id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? 'Matriculando...' : 'Matricular Estudiante'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Matrículas actuales */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Matrículas Actuales
            </h3>

            {matriculas_actuales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>El estudiante no tiene matrículas activas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matriculas_actuales.map((matricula) => (
                  <div
                    key={matricula.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{matricula.curso}</h4>
                        <p className="text-sm text-gray-500">
                          Código: {matricula.codigo_curso}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fecha matrícula: {matricula.fecha_matricula}
                        </p>
                        {matricula.fecha_finalizacion && (
                          <p className="text-sm text-gray-500">
                            Finaliza: {matricula.fecha_finalizacion}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(matricula.estado)}`}>
                        {matricula.estado}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Link
                        // href={route('admin.matriculas.materias', {
                        //   user: estudiante.id,
                        //   curso: matricula.id // Necesitarías pasar el ID real del curso
                        // })}
                        href={admin.matriculas.materias({
                          user: estudiante.id,
                          curso: matricula.id_curso,
                        }).url}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Gestionar materias →
                      </Link>
                      <Link
                        // href={route('admin.matriculas.edit', matricula.id)}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información del estudiante */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Información del Estudiante</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{estudiante.nombre}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{estudiante.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Rol:</span>
                <span className="font-medium">{estudiante.rol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Matrículas totales:</span>
                <span className="font-medium">{matriculas_actuales.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}