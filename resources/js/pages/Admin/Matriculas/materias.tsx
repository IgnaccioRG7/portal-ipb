// resources/js/pages/Admin/Matriculas/materias.tsx
import ContentLayout from '@/layouts/content-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';
import { BookOpen, CheckCircle, ChevronDown, ChevronRight, BookText, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
}

interface Curso {
  id: number;
  nombre: string;
  codigo_curso: string;
}

interface Matricula {
  id: number;
  codigo_matricula: string;
}

interface Tema {
  id: number;
  nombre: string;
  codigo_tema: string;
  tipo: string;
  seleccionado: boolean;
}

interface Materia {
  id: number;
  materia_id: number;
  materia_nombre: string;
  materia_codigo: string;
  horas_semanales: number;
  temas: Tema[];
}

export default function MatriculaMaterias({
  estudiante,
  curso,
  matricula,
  materias,
}: {
  estudiante: Estudiante;
  curso: Curso;
  matricula: Matricula;
  materias: Materia[];
}) {
  console.log(estudiante);
  console.log(curso);
  console.log(matricula);
  console.log(materias);


  const [expandedMaterias, setExpandedMaterias] = useState<number[]>([]);
  const [selectedTemas, setSelectedTemas] = useState<{ curso_materia_id: number; tema_id: number }[]>(
    materias.flatMap(materia =>
      materia.temas
        .filter(tema => tema.seleccionado)
        .map(tema => ({
          curso_materia_id: materia.id,
          tema_id: tema.id,
        }))
    )
  );

  const { post, processing, errors } = useForm<{
    temas: { curso_materia_id: number; tema_id: number }[];
  }>({
    temas: selectedTemas,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: admin.users.index().url },
    {
      title: estudiante.nombre,
      // href: route('admin.matriculas.estudiante', estudiante.id) 
      href: ''
    },
    { title: curso.nombre, href: '#' },
  ];

  const toggleMateria = (materiaId: number) => {
    setExpandedMaterias(prev =>
      prev.includes(materiaId)
        ? prev.filter(id => id !== materiaId)
        : [...prev, materiaId]
    );
  };

  const toggleTema = (cursoMateriaId: number, temaId: number) => {
    setSelectedTemas(prev => {
      const exists = prev.find(
        t => t.curso_materia_id === cursoMateriaId && t.tema_id === temaId
      );

      if (exists) {
        return prev.filter(
          t => !(t.curso_materia_id === cursoMateriaId && t.tema_id === temaId)
        );
      } else {
        return [...prev, { curso_materia_id: cursoMateriaId, tema_id: temaId }];
      }
    });
  };

  const selectAllTemas = (materiaId: number) => {
    const materia = materias.find(m => m.id === materiaId);
    if (!materia) return;

    const temasMateria = materia.temas.map(tema => ({
      curso_materia_id: materia.id,
      tema_id: tema.id,
    }));

    setSelectedTemas(prev => {
      // Filtrar temas de esta materia
      const otrosTemas = prev.filter(
        t => t.curso_materia_id !== materiaId
      );

      // Agregar todos los temas de esta materia
      return [...otrosTemas, ...temasMateria];
    });
  };

  const deselectAllTemas = (materiaId: number) => {
    setSelectedTemas(prev =>
      prev.filter(t => t.curso_materia_id !== materiaId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('ENVIANDO FORMULARIO');
    console.log(selectedTemas);


    e.preventDefault();
    // post(route('admin.matriculas.guardar-temas', {
    //     user: estudiante.id,
    //     curso: curso.id,
    // }));
    // post(admin.matriculas.guardarTemas({
    //   user: estudiante.id,
    //   curso: curso.id,
    // }).url,);
    router.post(
      admin.matriculas.guardarTemas({
        user: estudiante.id,
        curso: curso.id,
      }).url,
      {
        temas: selectedTemas,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          console.log('✅ Temas guardados exitosamente');
        },
        onError: (errors) => {
          console.error('❌ Error:', errors);
        },
      }
    );
  };

  const handleEliminarMatricula = () => {
    if (confirm(`🚨 ¿ELIMINAR MATRÍCULA COMPLETA?\n\nEstudiante: ${estudiante.nombre}\nCurso: ${curso.nombre}\nCódigo: ${matricula.codigo_matricula}\n\n⚠️ Esta acción:\n1. Eliminará TODA la matrícula\n2. Eliminará TODOS los temas asignados\n3. NO se puede deshacer\n\n¿Continuar?`)) {

      router.delete(
        admin.matriculas.destroy(matricula.id).url,
        {
          onSuccess: () => {
            console.log('✅ Matrícula eliminada exitosamente');
            // Redirige automáticamente a la vista del estudiante
          },
          onError: (errors) => {
            console.error('❌ Error al eliminar matrícula:', errors);
            alert('Error al eliminar la matrícula. Verifica la consola.');
          },
        }
      );
    }
  };

  const totalTemas = materias.reduce((acc, materia) => acc + materia.temas.length, 0);
  const temasSeleccionados = selectedTemas.length;

  return (
    <ContentLayout
      title={`Asignar Temas: ${curso.nombre}`}
      subtitle={`Estudiante: ${estudiante.nombre} | Código Matrícula: ${matricula.codigo_matricula}`}
      breadcrumbs={breadcrumbs}
    >
      <Head title={`Temas - ${curso.nombre}`} />

      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Materias del Curso</p>
                <p className="text-2xl font-bold">{materias.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Temas Totales</p>
                <p className="text-2xl font-bold">{totalTemas}</p>
              </div>
              <BookText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Temas Seleccionados</p>
                <p className="text-2xl font-bold">{temasSeleccionados}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lista de materias */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Seleccionar Temas por Materia</h3>
              <p className="text-sm text-gray-500 mt-1">
                Marca los temas a los que tendrá acceso el estudiante
              </p>
            </div>

            <div className="divide-y">
              {materias.map((materia) => {
                const isExpanded = expandedMaterias.includes(materia.id);
                const temasMateriaSeleccionados = selectedTemas.filter(
                  t => t.curso_materia_id === materia.id
                ).length;
                const todosSeleccionados = temasMateriaSeleccionados === materia.temas.length;

                return (
                  <div key={materia.id} className="p-6">
                    {/* Header de materia */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleMateria(materia.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <h4 className="font-semibold">{materia.materia_nombre}</h4>
                          <p className="text-sm text-gray-500">
                            Código: {materia.materia_codigo} |
                            Horas: {materia.horas_semanales}/semana
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {temasMateriaSeleccionados}/{materia.temas.length} temas
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            todosSeleccionados
                              ? deselectAllTemas(materia.id)
                              : selectAllTemas(materia.id);
                          }}
                        >
                          {todosSeleccionados ? 'Desmarcar todos' : 'Marcar todos'}
                        </Button>
                      </div>
                    </div>

                    {/* Lista de temas (expandible) */}
                    {isExpanded && (
                      <div className="mt-4 pl-8 space-y-3">
                        {materia.temas.map((tema) => (
                          <div
                            key={tema.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Checkbox
                              checked={selectedTemas.some(
                                t => t.curso_materia_id === materia.id && t.tema_id === tema.id
                              )}
                              onCheckedChange={() => toggleTema(materia.id, tema.id)}
                              id={`tema-${tema.id}`}
                            />
                            <label
                              htmlFor={`tema-${tema.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{tema.nombre}</p>
                                  <p className="text-sm text-gray-500">
                                    Código: {tema.codigo_tema} | Tipo: {tema.tipo}
                                  </p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600">
                                  {tema.seleccionado ? 'Previamente seleccionado' : 'Nuevo'}
                                </span>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen y botones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Resumen</h3>
                <p className="text-sm text-gray-500">
                  {temasSeleccionados} temas seleccionados de {totalTemas} disponibles
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estudiante</p>
                <p className="font-semibold">{estudiante.nombre}</p>
              </div>
            </div>

            <InputError message={errors.temas} />

            <div className="flex justify-between items-center pt-4 border-t">
              <Link
                // href={route('admin.matriculas.estudiante', estudiante.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Volver al estudiante
              </Link>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleEliminarMatricula}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar Esta Matrícula
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedTemas([])}
                  disabled={selectedTemas.length === 0}
                >
                  Limpiar selección
                </Button>
                <Button
                  type="submit"
                  // disabled={processing || selectedTemas.length === 0}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? 'Guardando...' : `Guardar ${selectedTemas.length} temas`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLayout>
  );
}