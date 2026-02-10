// resources/js/pages/Admin/Matriculas/modulos.tsx
import ContentLayout from '@/layouts/content-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';
import { BookOpen, CheckCircle, ChevronDown, ChevronRight, Calendar, Trash2, Layers, BookText } from 'lucide-react';
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

interface Materia {
  modulo_materia_id: number;
  materia_id: number;
  materia_nombre: string;
  materia_codigo: string;
  seleccionada: boolean;
}

interface Modulo {
  id: number;
  nombre: string;
  codigo_modulo: string;
  fecha_inicio: string;
  fecha_fin: string;
  materias: Materia[];
}

export default function MatriculaModulos({
  estudiante,
  curso,
  matricula,
  modulos,
}: {
  estudiante: Estudiante;
  curso: Curso;
  matricula: Matricula;
  modulos: Modulo[];
}) {
  console.log(estudiante);
  console.log(curso);
  console.log(matricula);
  console.log(modulos);

  const [expandedModulos, setExpandedModulos] = useState<number[]>([]);
  const [selectedModulosMaterias, setSelectedModulosMaterias] = useState<{ modulo_materia_id: number }[]>(
    modulos.flatMap(modulo =>
      modulo.materias
        .filter(materia => materia.seleccionada)
        .map(materia => ({
          modulo_materia_id: materia.modulo_materia_id,
        }))
    )
  );

  const { post, processing, errors } = useForm<{
    modulos_materias: { modulo_materia_id: number }[];
  }>({
    modulos_materias: selectedModulosMaterias,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: admin.users.index().url },
    {
      title: estudiante.nombre,
      href: admin.matriculas.estudiante(estudiante.id).url
    },
    { title: curso.nombre, href: '#' },
  ];

  const toggleModulo = (moduloId: number) => {
    setExpandedModulos(prev =>
      prev.includes(moduloId)
        ? prev.filter(id => id !== moduloId)
        : [...prev, moduloId]
    );
  };

  const toggleMateria = (moduloMateriaId: number) => {
    setSelectedModulosMaterias(prev => {
      const exists = prev.find(
        m => m.modulo_materia_id === moduloMateriaId
      );

      if (exists) {
        return prev.filter(m => m.modulo_materia_id !== moduloMateriaId);
      } else {
        return [...prev, { modulo_materia_id: moduloMateriaId }];
      }
    });
  };

  const selectAllMateriasModulo = (moduloId: number) => {
    const modulo = modulos.find(m => m.id === moduloId);
    if (!modulo) return;

    const materiasModulo = modulo.materias.map(materia => ({
      modulo_materia_id: materia.modulo_materia_id,
    }));

    setSelectedModulosMaterias(prev => {
      // Filtrar materias de otros módulos
      const otrasMaterias = prev.filter(m => {
        const materiaModulo = modulos.flatMap(mod => mod.materias)
          .find(mm => mm.modulo_materia_id === m.modulo_materia_id);
        return materiaModulo && !modulo.materias.some(mm => mm.modulo_materia_id === m.modulo_materia_id);
      });

      // Agregar todas las materias de este módulo
      return [...otrasMaterias, ...materiasModulo];
    });
  };

  const deselectAllMateriasModulo = (moduloId: number) => {
    const modulo = modulos.find(m => m.id === moduloId);
    if (!modulo) return;

    const moduloMateriaIds = modulo.materias.map(m => m.modulo_materia_id);
    
    setSelectedModulosMaterias(prev =>
      prev.filter(m => !moduloMateriaIds.includes(m.modulo_materia_id))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('ENVIANDO FORMULARIO');
    console.log(selectedModulosMaterias);

    e.preventDefault();
    
    router.post(
      admin.matriculas.guardarModulos({
        user: estudiante.id,
        curso: curso.id,
      }).url,
      {
        modulos_materias: selectedModulosMaterias,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          console.log('✅ Módulos y materias guardados exitosamente');
        },
        onError: (errors) => {
          console.error('❌ Error:', errors);
        },
      }
    );
  };

  const handleEliminarMatricula = () => {
    if (confirm(`🚨 ¿ELIMINAR MATRÍCULA COMPLETA?\n\nEstudiante: ${estudiante.nombre}\nCurso: ${curso.nombre}\nCódigo: ${matricula.codigo_matricula}\n\n⚠️ Esta acción:\n1. Eliminará TODA la matrícula\n2. Eliminará TODOS los accesos asignados\n3. NO se puede deshacer\n\n¿Continuar?`)) {
      router.delete(
        admin.matriculas.destroy(matricula.id).url,
        {
          onSuccess: () => {
            console.log('✅ Matrícula eliminada exitosamente');
          },
          onError: (errors) => {
            console.error('❌ Error al eliminar matrícula:', errors);
            alert('Error al eliminar la matrícula. Verifica la consola.');
          },
        }
      );
    }
  };

  // Calcular estadísticas
  const totalModulos = modulos.length;
  const totalMaterias = modulos.reduce((acc, modulo) => acc + modulo.materias.length, 0);
  const materiasSeleccionadas = selectedModulosMaterias.length;

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <ContentLayout
      title={`Asignar Módulos y Materias: ${curso.nombre}`}
      subtitle={`Estudiante: ${estudiante.nombre} | Código Matrícula: ${matricula.codigo_matricula}`}
      breadcrumbs={breadcrumbs}
    >
      <Head title={`Módulos - ${curso.nombre}`} />

      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Módulos Disponibles</p>
                <p className="text-2xl font-bold">{totalModulos}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Materias Totales</p>
                <p className="text-2xl font-bold">{totalMaterias}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Materias Seleccionadas</p>
                <p className="text-2xl font-bold">{materiasSeleccionadas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Temas Incluidos</p>
                <p className="text-2xl font-bold">Todos*</p>
              </div>
              <BookText className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">*Incluye todos los temas de cada materia</p>
          </div>
        </div>

        {/* Información */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                El estudiante tendrá acceso a <strong>todos los temas</strong> 
                de las materias seleccionadas en cada módulo. Selecciona las materias dentro de cada módulo a las que el estudiante tendrá acceso.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lista de módulos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Seleccionar Módulos y Materias</h3>
              <p className="text-sm text-gray-500 mt-1">
                Marca las materias dentro de cada módulo a las que tendrá acceso el estudiante
              </p>
            </div>

            <div className="divide-y">
              {modulos.map((modulo) => {
                const isExpanded = expandedModulos.includes(modulo.id);
                const materiasModuloSeleccionadas = selectedModulosMaterias.filter(m => {
                  const materiaModulo = modulo.materias.find(mm => mm.modulo_materia_id === m.modulo_materia_id);
                  return materiaModulo !== undefined;
                }).length;
                const todasSeleccionadas = materiasModuloSeleccionadas === modulo.materias.length;

                return (
                  <div key={modulo.id} className="p-6">
                    {/* Header del módulo */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleModulo(modulo.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{modulo.nombre}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                              {modulo.codigo_modulo}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(modulo.fecha_inicio)} - {formatDate(modulo.fecha_fin)}</span>
                            </div>
                            <span>{modulo.materias.length} materia(s)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {materiasModuloSeleccionadas}/{modulo.materias.length} materias
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            todasSeleccionadas
                              ? deselectAllMateriasModulo(modulo.id)
                              : selectAllMateriasModulo(modulo.id);
                          }}
                        >
                          {todasSeleccionadas ? 'Desmarcar todas' : 'Marcar todas'}
                        </Button>
                      </div>
                    </div>

                    {/* Lista de materias (expandible) */}
                    {isExpanded && (
                      <div className="mt-4 pl-8 space-y-3">
                        {modulo.materias.map((materia) => (
                          <div
                            key={materia.modulo_materia_id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Checkbox
                              checked={selectedModulosMaterias.some(
                                m => m.modulo_materia_id === materia.modulo_materia_id
                              )}
                              onCheckedChange={() => toggleMateria(materia.modulo_materia_id)}
                              id={`materia-${materia.modulo_materia_id}`}
                            />
                            <label
                              htmlFor={`materia-${materia.modulo_materia_id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{materia.materia_nombre}</p>
                                  <p className="text-sm text-gray-500">
                                    Código: {materia.materia_codigo}
                                  </p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600">
                                  {materia.seleccionada ? 'Previamente asignada' : 'Nueva asignación'}
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
                <h3 className="text-lg font-semibold">Resumen de Asignación</h3>
                <p className="text-sm text-gray-500">
                  {materiasSeleccionadas} materias seleccionadas de {totalMaterias} disponibles en {totalModulos} módulos
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estudiante</p>
                <p className="font-semibold">{estudiante.nombre}</p>
                <p className="text-sm text-gray-500">Matrícula: {matricula.codigo_matricula}</p>
              </div>
            </div>

            {/* Módulos seleccionados (resumen) */}
            {selectedModulosMaterias.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Módulos con acceso:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modulos.map(modulo => {
                    const materiasSeleccionadasEnModulo = modulo.materias.filter(materia =>
                      selectedModulosMaterias.some(m => m.modulo_materia_id === materia.modulo_materia_id)
                    ).length;
                    
                    if (materiasSeleccionadasEnModulo === 0) return null;
                    
                    return (
                      <div key={modulo.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{modulo.nombre}</p>
                            <p className="text-sm text-gray-500">
                              {materiasSeleccionadasEnModulo} de {modulo.materias.length} materias
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded">
                            {materiasSeleccionadasEnModulo === modulo.materias.length ? 'Completo' : 'Parcial'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <InputError message={errors.modulos_materias} />

            <div className="flex justify-between items-center pt-4 border-t">
              <Link
                href={admin.matriculas.estudiante(estudiante.id).url}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
                  Eliminar Matrícula
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedModulosMaterias([])}
                  disabled={selectedModulosMaterias.length === 0}
                >
                  Limpiar selección
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? 'Guardando...' : `Guardar ${materiasSeleccionadas} materias`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLayout>
  );
}