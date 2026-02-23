import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Plus, Calendar, User, AlertCircle, Power } from 'lucide-react';

interface Materia {
  id: number;
  codigo_materia: string;
  nombre: string;
  area: string;
  color: string;
}

interface MateriaEnModulo {
  modulo_materia_id?: number;
  materia_id: number;
  prof_id: number | null;
  orden: number;
  estado: 'activo' | 'inactivo';
}

interface Profesor {
  id: number;
  nombre_completo: string;
  email: string;
}

interface Modulo {
  id?: number;
  codigo_modulo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'activo' | 'inactivo';
  materias: MateriaEnModulo[];
  tiene_dependencias?: boolean;
}

interface Curso {
  id: number;
  nombre: string;
  codigo_curso: string;
}

interface Props {
  curso: Curso;
  todasLasMaterias: Materia[];
  profesores: Profesor[];
  modulos: Modulo[];
  errors: Record<string, string>;
  processing: boolean;
}

export default function AsignarMaterias({
  curso,
  todasLasMaterias,
  profesores = [],
  modulos = [],
  errors = {},
  processing = false
}: Props) {
  console.log(modulos);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: admin.cursos.index().url },
    { title: curso.nombre, href: admin.cursos.edit({ curso: curso.id }).url },
    { title: 'Asignar Materias', href: '#' },
  ];

  // Estado para TODOS los módulos (activos e inactivos) en orden secuencial
  const [modulosState, setModulosState] = useState<Modulo[]>(() => {
    if (modulos.length > 0) {
      // Ordenar por código (m1, m2, m3...)
      const ordenados = [...modulos].sort((a, b) => {
        const numA = parseInt(a.codigo_modulo.replace('m', ''));
        const numB = parseInt(b.codigo_modulo.replace('m', ''));
        return numA - numB;
      });
      return ordenados;
    }
    // Módulo por defecto
    return [{
      codigo_modulo: 'm1',
      nombre: 'Módulo 1',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      estado: 'activo',
      materias: [],
      tiene_dependencias: false
    }];
  });

  const [modulosExpandidos, setModulosExpandidos] = useState<number[]>([0]);

  // Agregar módulo - SIEMPRE con código secuencial
  const agregarModulo = () => {
    const nuevoNumero = modulosState.length + 1;
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 3);

    // Calcular fecha de inicio basada en el último módulo
    if (modulosState.length > 0) {
      const ultimoModulo = modulosState[modulosState.length - 1];
      const ultimaFecha = new Date(ultimoModulo.fecha_fin);
      ultimaFecha.setDate(ultimaFecha.getDate() + 1);
      fechaInicio.setTime(ultimaFecha.getTime());
      fechaFin.setMonth(fechaInicio.getMonth() + 1);
    }

    setModulosState([
      ...modulosState,
      {
        codigo_modulo: `m${nuevoNumero}`,
        nombre: `Módulo ${nuevoNumero}`,
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0],
        estado: 'activo', // Por defecto activo
        materias: [],
        tiene_dependencias: false
      }
    ]);

    setModulosExpandidos([...modulosExpandidos, modulosState.length]);
  };

  // TOGGLE estado del módulo (activo/inactivo)
  const toggleModuloEstado = (index: number) => {
    setModulosState(
      modulosState.map((mod, i) =>
        i === index
          ? { ...mod, estado: mod.estado === 'activo' ? 'inactivo' : 'activo' }
          : mod
      )
    );
  };

  const actualizarModulo = (index: number, campo: keyof Modulo, valor: string) => {
    setModulosState(
      modulosState.map((mod, i) =>
        i === index ? { ...mod, [campo]: valor } : mod
      )
    );
  };

  // Funciones para materias...
  const agregarMateriaAModulo = (moduloIndex: number, materiaId: string) => {
    const id = parseInt(materiaId);
    setModulosState(
      modulosState.map((mod, i) => {
        if (i === moduloIndex) {
          const yaExiste = mod.materias.some(m => m.materia_id === id);
          if (!yaExiste) {
            return {
              ...mod,
              materias: [
                ...mod.materias,
                {
                  materia_id: id,
                  prof_id: null,
                  orden: mod.materias.length + 1,
                  estado: 'activo' // Por defecto activo
                }
              ]
            };
          }
        }
        return mod;
      })
    );
  };

  const eliminarMateriaDeModulo = (moduloIndex: number, materiaId: number) => {
    setModulosState(
      modulosState.map((mod, i) => {
        if (i === moduloIndex) {
          return {
            ...mod,
            materias: mod.materias.filter(m => m.materia_id !== materiaId)
          };
        }
        return mod;
      })
    );
  };

  // TOGGLE estado de la materia (activo/inactivo)
  const toggleMateriaEstado = (moduloIndex: number, materiaId: number) => {
    setModulosState(
      modulosState.map((mod, i) => {
        if (i === moduloIndex) {
          return {
            ...mod,
            materias: mod.materias.map(m =>
              m.materia_id === materiaId
                ? { ...m, estado: m.estado === 'activo' ? 'inactivo' : 'activo' }
                : m
            )
          };
        }
        return mod;
      })
    );
  };

  const actualizarProfesorMateria = (moduloIndex: number, materiaId: number, profId: string) => {
    setModulosState(
      modulosState.map((mod, i) => {
        if (i === moduloIndex) {
          return {
            ...mod,
            materias: mod.materias.map(m =>
              m.materia_id === materiaId
                ? { ...m, prof_id: profId === "null" || profId === "" ? null : parseInt(profId) }
                : m
            )
          };
        }
        return mod;
      })
    );
  };

  const actualizarOrdenMateria = (moduloIndex: number, materiaId: number, orden: string) => {
    const valor = parseInt(orden) || 1;
    setModulosState(
      modulosState.map((mod, i) => {
        if (i === moduloIndex) {
          return {
            ...mod,
            materias: mod.materias.map(m =>
              m.materia_id === materiaId ? { ...m, orden: valor } : m
            )
          };
        }
        return mod;
      })
    );
  };

  const toggleModuloExpandido = (index: number) => {
    setModulosExpandidos(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // SUBMIT - Enviar TODOS los módulos con sus estados
  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enviar TODOS los módulos (activos e inactivos)
    const modulosData = modulosState.map(modulo => ({
      codigo_modulo: modulo.codigo_modulo,
      nombre: modulo.nombre,
      fecha_inicio: modulo.fecha_inicio,
      fecha_fin: modulo.fecha_fin,
      estado: modulo.estado,
      materias: modulo.materias.map(m => ({
        materia_id: m.materia_id,
        prof_id: m.prof_id,
        orden: m.orden,
        estado: m.estado
      }))
    }));

    router.post(
      admin.cursos.guardarMaterias({ curso: curso.id }).url,
      { modulos: modulosData },
      {
        preserveScroll: true,
        onSuccess: () => {
          console.log('Módulos y materias guardados');
        },
        onError: (errors) => {
          console.error('❌ Error:', errors);
        },
      }
    );
  };

  const formatDateForInput = (date: string) => {
    return date.split('T')[0];
  };


  // ELIMINAR módulo (solo si no tiene dependencias)
  const eliminarModulo = (index: number) => {
    const modulo = modulosState[index];

    if (modulo.tiene_dependencias) {
      alert('❌ No se puede eliminar este módulo porque tiene temas creados o estudiantes matriculados.\n\nSolo puedes inactivarlo usando el switch.');
      return;
    }

    if (confirm(`¿Eliminar permanentemente el módulo "${modulo.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      const nuevosModulos = modulosState.filter((_, i) => i !== index)

      console.log(nuevosModulos);
      

      setModulosState(nuevosModulos);
      setModulosExpandidos(modulosExpandidos.filter(i => i !== index));
    }
  };

  // Contar módulos activos e inactivos
  const modulosActivos = modulosState.filter(m => m.estado === 'activo');
  const modulosInactivos = modulosState.filter(m => m.estado === 'inactivo');

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title={`Configurar Módulos: ${curso.nombre}`}
      subtitle="Los módulos son SECUENCIALES y NUNCA se eliminan, solo se activan/inactivan"
    >
      <Head title={`Configurar Módulos - ${curso.nombre}`} />

      <section className="pt-0 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">

          {/* 📊 ESTADÍSTICAS DE MÓDULOS */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Módulos</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {modulosState.length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Activos</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {modulosActivos.length}
                  </p>
                </div>
                <Power className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {modulosInactivos.length}
                  </p>
                </div>
                <Power className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-8">
            {/* Información del curso */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                • Los módulos inactivos no son visibles para estudiantes ni profesores<br />
                • Las materias también pueden activarse/inactivarse individualmente
              </p>
            </div>

            {/* Lista de módulos */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Módulos del Curso
                </h3>
                <Button
                  type="button"
                  onClick={agregarModulo}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar nuevo módulo
                </Button>
              </div>

              <InputError message={errors.modulos as string} />

              {modulosState.map((modulo, moduloIndex) => {
                const isExpanded = modulosExpandidos.includes(moduloIndex);
                const numeroModulo = moduloIndex + 1;
                const esInactivo = modulo.estado === 'inactivo';

                return (
                  <div
                    key={modulo.codigo_modulo}
                    className={`border rounded-lg ${esInactivo
                      ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                      }`}
                  >
                    {/* Header del módulo */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3 flex-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleModuloExpandido(moduloIndex)}
                          className="p-1"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold px-2 py-1 rounded ${esInactivo
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              : 'bg-gray-200 dark:bg-gray-600'
                              }`}>
                              {modulo.codigo_modulo}
                            </span>
                            <Input
                              value={modulo.nombre}
                              onChange={(e) => actualizarModulo(moduloIndex, 'nombre', e.target.value)}
                              className={`w-64 ${esInactivo ? 'opacity-70' : ''}`}
                              placeholder={`Módulo ${numeroModulo}`}
                              required
                              disabled={esInactivo} // No editar si está inactivo
                            />
                            {/* SWITCH PARA ACTIVAR/INACTIVAR MÓDULO */}
                            <div className="flex items-center gap-2 ml-2">
                              <Switch
                                checked={modulo.estado === 'activo'}
                                onCheckedChange={() => toggleModuloEstado(moduloIndex)}
                                id={`modulo-${moduloIndex}`}
                              />
                              <Label htmlFor={`modulo-${moduloIndex}`} className="text-sm cursor-pointer">
                                {modulo.estado === 'activo' ? 'Activo' : 'Inactivo'}
                              </Label>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className={`w-4 h-4 ${esInactivo ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={esInactivo ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>Inicio:</span>
                              <Input
                                type="date"
                                value={formatDateForInput(modulo.fecha_inicio)}
                                onChange={(e) => actualizarModulo(moduloIndex, 'fecha_inicio', e.target.value)}
                                className={`w-36 ${esInactivo ? 'opacity-70' : ''}`}
                                required
                                disabled={esInactivo}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className={`w-4 h-4 ${esInactivo ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={esInactivo ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>Fin:</span>
                              <Input
                                type="date"
                                value={formatDateForInput(modulo.fecha_fin)}
                                onChange={(e) => actualizarModulo(moduloIndex, 'fecha_fin', e.target.value)}
                                className={`w-36 ${esInactivo ? 'opacity-70' : ''}`}
                                required
                                disabled={esInactivo}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <span className={`text-sm ${esInactivo ? 'text-gray-400' : 'text-gray-500'}`}>
                          {modulo.materias.filter(m => m.estado === 'activo').length} materia(s) activas
                          {modulo.materias.length > 0 && (
                            <span className="text-xs ml-1">
                              ({modulo.materias.length} total)
                            </span>
                          )}
                        </span>

                        {/* BOTÓN DE ELIMINAR - Solo si NO tiene dependencias */}
                        {!modulo.tiene_dependencias && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => eliminarModulo(moduloIndex)}
                            title={modulo.tiene_dependencias
                              ? "No se puede eliminar - Tiene dependencias"
                              : "Eliminar módulo permanentemente"}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        {/* Si tiene dependencias, mostrar badge informativo */}
                        {modulo.tiene_dependencias && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            🔒 Con dependencias
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contenido expandible del módulo */}
                    {isExpanded && (
                      <div className="p-4 space-y-4">
                        {/* Selector de materias - SOLO si módulo activo */}
                        {!esInactivo ? (
                          <div>
                            <Label>Agregar Materia a este Módulo</Label>
                            <Select onValueChange={(value) => agregarMateriaAModulo(moduloIndex, value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una materia para agregar" />
                              </SelectTrigger>
                              <SelectContent>
                                {todasLasMaterias
                                  .filter(m => !modulo.materias.some(ms => ms.materia_id === m.id))
                                  .map(materia => (
                                    <SelectItem
                                      key={materia.id}
                                      value={materia.id.toString()}
                                    >
                                      {materia.nombre} ({materia.codigo_materia})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ⚠️ Módulo inactivo - No se pueden agregar materias
                            </p>
                          </div>
                        )}

                        {/* Lista de materias del módulo */}
                        <div className="space-y-3">
                          <h4 className={`font-medium ${esInactivo ? 'text-gray-500' : ''}`}>
                            Materias del módulo:
                          </h4>

                          {modulo.materias.length === 0 ? (
                            <p className={`text-sm ${esInactivo ? 'text-gray-400' : 'text-gray-500'}`}>
                              No hay materias asignadas a este módulo
                            </p>
                          ) : (
                            modulo.materias.map((materia) => {
                              const materiaInfo = todasLasMaterias.find(m => m.id === materia.materia_id);
                              if (!materiaInfo) return null;
                              const materiaInactiva = materia.estado === 'inactivo';

                              return (
                                <div
                                  key={materia.materia_id}
                                  className={`border rounded-lg p-4 ${materiaInactiva
                                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                                    : 'bg-white dark:bg-gray-800'
                                    }`}
                                >
                                  <div className="grid grid-cols-12 gap-4 items-start">
                                    {/* Información de la materia */}
                                    <div className="col-span-3">
                                      <div className="flex items-center gap-2">
                                        <p className={`font-semibold ${materiaInactiva ? 'text-gray-500' : ''}`}>
                                          {materiaInfo.nombre}
                                        </p>
                                        {/* SWITCH para materia (solo si módulo activo) */}
                                        {!esInactivo && (
                                          <div className="flex items-center gap-1">
                                            <Switch
                                              checked={materia.estado === 'activo'}
                                              onCheckedChange={() => toggleMateriaEstado(moduloIndex, materia.materia_id)}
                                              id={`materia-${moduloIndex}-${materia.materia_id}`}
                                              className="scale-75"
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <p className={`text-xs ${materiaInactiva ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {materiaInfo.codigo_materia} • {materiaInfo.area}
                                      </p>
                                      {materiaInactiva && (
                                        <span className="text-xs text-gray-400 mt-1 block">
                                          ⚠️ Inactiva
                                        </span>
                                      )}
                                    </div>

                                    {/* Orden */}
                                    <div className="col-span-2">
                                      <Label className={`text-xs ${materiaInactiva ? 'text-gray-400' : ''}`}>
                                        Orden
                                      </Label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={materia.orden}
                                        onChange={(e) => actualizarOrdenMateria(
                                          moduloIndex,
                                          materia.materia_id,
                                          e.target.value
                                        )}
                                        className={`h-8 ${materiaInactiva || esInactivo ? 'opacity-70' : ''}`}
                                        disabled={materiaInactiva || esInactivo}
                                      />
                                    </div>

                                    {/* SELECTOR DE PROFESOR */}
                                    <div className="col-span-4">
                                      <Label className={`text-xs flex items-center gap-1 ${materiaInactiva ? 'text-gray-400' : ''}`}>
                                        <User className="w-3 h-3" />
                                        Profesor
                                      </Label>
                                      <Select
                                        value={materia.prof_id?.toString() || "null"}
                                        onValueChange={(value) => actualizarProfesorMateria(
                                          moduloIndex,
                                          materia.materia_id,
                                          value
                                        )}
                                        disabled={materiaInactiva || esInactivo}
                                      >
                                        <SelectTrigger className={`h-8 ${materiaInactiva || esInactivo ? 'opacity-70' : ''}`}>
                                          <SelectValue placeholder="Seleccionar profesor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="null">Sin asignar</SelectItem>
                                          {profesores.map((prof) => (
                                            <SelectItem key={prof.id} value={prof.id.toString()}>
                                              {prof.nombre_completo}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Botón eliminar materia - SOLO si módulo activo */}
                                    <div className="col-span-1 flex justify-end">
                                      {!esInactivo && (
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          onClick={() => eliminarMateriaDeModulo(moduloIndex, materia.materia_id)}
                                          title="Eliminar materia (la inactivará)"
                                        >
                                          <Trash2 size={16} />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4 justify-end border-t pt-4">
              <Link
                href={admin.cursos.index().url}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="bg-green-600 text-white hover:bg-green-500"
              >
                {processing ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </ContentLayout>
  );
}