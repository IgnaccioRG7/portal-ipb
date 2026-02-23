import ContentLayout from '@/layouts/content-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import cursos from '@/routes/cursos';
import InputError from '@/components/input-error';
import { useState } from 'react';

type Question = {
  id: string;
  type: 'select';
  text: string;
  options: string[];
  correctAnswer: number;
};

type TemaContent = {
  reading?: string;
  questions: Question[];
};

export default function TemaEdit({ tema, curso, modulo, materia }: any) {
  console.log(tema);

  const { data, setData, put, processing, errors } = useForm<{
    nombre: string;
    descripcion: string;
    tipo: string;
    estado: string;
    contenido: TemaContent;
    max_intentos: number | null;
    randomizar_preguntas: boolean;
    randomizar_respuestas: boolean;
  }>({
    nombre: tema.nombre || '',
    descripcion: tema.descripcion || '',
    tipo: tema.tipo,
    estado: tema.estado,
    max_intentos: tema.max_intentos,
    contenido: tema.contenido || { questions: [] },
    randomizar_preguntas: tema?.randomizar_preguntas || false,
    randomizar_respuestas: tema?.randomizar_respuestas || false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: cursos.index().url },
    { title: curso.nombre, href: cursos.modulos(curso.id).url },
    { title: modulo.nombre, href: cursos.materias({ curso: curso.id, modulo: modulo.id }).url },
    { title: materia.nombre, href: cursos.temas({ curso: curso.id, modulo: modulo.id, materia: materia.id }).url },
    { title: tema.nombre || 'Editar Tema', href: '#' }
  ];

  // ✅ Manejar cambio de tipo
  const handleTipoChange = (newTipo: string) => {
    setData('tipo', newTipo);

    if (newTipo !== 'lectura' && data.contenido.reading) {
      const { reading, ...rest } = data.contenido;
      setData('contenido', rest);
    }
    else if (newTipo === 'lectura' && !data.contenido.reading) {
      setData('contenido', { ...data.contenido, reading: '' });
    }
  };

  // Agregar nueva pregunta
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'select',
      text: '',
      options: ['', ''],
      correctAnswer: 0
    };
    setData('contenido', {
      ...data.contenido,
      questions: [...data.contenido.questions, newQuestion]
    });
  };

  // Eliminar pregunta
  const removeQuestion = (index: number) => {
    const updated = data.contenido.questions.filter((_, i) => i !== index);
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Actualizar texto de pregunta
  const updateQuestionText = (index: number, text: string) => {
    const updated = [...data.contenido.questions];
    updated[index].text = text;
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Actualizar opción
  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...data.contenido.questions];
    updated[qIndex].options[optIndex] = value;
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Cambiar respuesta correcta
  const setCorrectAnswer = (qIndex: number, optIndex: number) => {
    const updated = [...data.contenido.questions];
    updated[qIndex].correctAnswer = optIndex;
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Agregar nueva opción
  const addOption = (qIndex: number) => {
    const updated = [...data.contenido.questions];
    updated[qIndex].options.push('');
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Eliminar opción
  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...data.contenido.questions];

    if (updated[qIndex].options.length <= 2) {
      alert('Debe haber al menos 2 opciones');
      return;
    }

    if (updated[qIndex].correctAnswer === optIndex) {
      updated[qIndex].correctAnswer = 0;
    }
    else if (updated[qIndex].correctAnswer > optIndex) {
      updated[qIndex].correctAnswer -= 1;
    }

    updated[qIndex].options.splice(optIndex, 1);
    setData('contenido', { ...data.contenido, questions: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(cursos.temas.update({
      curso: curso.id,
      modulo: modulo.id,
      materia: materia.id,
      tema: tema.id
    }).url);
  };

  // ✅ ELIMINAR TEMA
  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar el tema "${tema.nombre || tema.codigo_tema}"?\n\nEsta acción no se puede deshacer.`)) {
      router.delete(cursos.temas.destroy({
        curso: curso.id,
        modulo: modulo.id,
        materia: materia.id,
        tema: tema.id
      }).url, {
        onSuccess: () => {
          // Redirigir a la lista de temas
          router.visit(cursos.temas({
            curso: curso.id,
            modulo: modulo.id,
            materia: materia.id
          }).url);
        }
      });
    }
  };

  // Helper para errores
  const getQuestionError = (qIndex: number, field: 'text' | 'options') => {
    const key = `contenido.questions.${qIndex}.${field}`;
    return errors[key as keyof typeof errors];
  };

  const getOptionError = (qIndex: number, optIndex: number) => {
    const key = `contenido.questions.${qIndex}.options.${optIndex}`;
    return errors[key as keyof typeof errors];
  };

  return (
    <ContentLayout
      title={`Editar: ${tema.nombre || tema.codigo_tema}`}
      subtitle={`${materia.nombre} - ${modulo.nombre}`}
      breadcrumbs={breadcrumbs}
      actions={
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          title='Eliminar este tema'
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer"
        >
          {/* TODOHOY: importante eliminar el tema solo sino tiene dependencias en los resultados */}
          <Trash2 size={24} className="" />
          <span>Eliminar tema</span>
        </Button>
      }
    >
      <Head title="Editar Tema" />

      <form onSubmit={handleSubmit} className="space-y-6"
        style={{
          height: 'calc(100vh - 300px)'
        }}>

        {/* Info básica */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Información del Tema</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigo_tema">Código del Tema</Label>
              <Input
                id="codigo_tema"
                value={tema.codigo_tema}
                disabled
                className="bg-gray-100 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">El código no se puede modificar</p>
            </div>

            <div>
              <Label htmlFor="nombre">Nombre del Tema</Label>
              <Input
                id="nombre"
                value={data.nombre}
                onChange={e => setData('nombre', e.target.value)}
                placeholder="Ej: Deforestación y cambio climático"
              />
              <InputError message={errors.nombre} />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                value={data.estado}
                onChange={e => setData('estado', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="borrador">Borrador</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className='col-span-1 lg:col-span-2'>
              <Label htmlFor="tipo">Tipo de Tema *</Label>
              <select
                id="tipo"
                value={data.tipo}
                onChange={e => handleTipoChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="opcional">Opcional</option>
                <option value="lectura">Lectura</option>
                <option value="configurable">Configurable</option>
              </select>
              <InputError message={errors.tipo} />
            </div>
            <div>
              <Label htmlFor='max_intentos'>Intentos permitidos</Label>
              <Input
                id='max_intentos'
                value={data.max_intentos ?? ''}
                type='number'
                placeholder='0, 1, 2, 10, 20, ...'
                onChange={(e) => setData('max_intentos', e.target.value ? parseInt(e.target.value) : null)}
              />
              <InputError message={errors.max_intentos} />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={data.descripcion}
              onChange={e => setData('descripcion', e.target.value)}
              rows={2}
              placeholder="Describe brevemente el tema..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <input
                type="checkbox"
                id="randomizar_preguntas"
                checked={data.randomizar_preguntas || false}
                onChange={(e) => setData('randomizar_preguntas', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <Label htmlFor="randomizar_preguntas" className="font-medium cursor-pointer">
                  🔀 Randomizar preguntas
                </Label>
                <p className="text-xs text-gray-500">
                  Las preguntas aparecerán en orden aleatorio para cada estudiante
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <input
                type="checkbox"
                id="randomizar_respuestas"
                checked={data.randomizar_respuestas || false}
                onChange={(e) => setData('randomizar_respuestas', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <Label htmlFor="randomizar_respuestas" className="font-medium cursor-pointer">
                  🎲 Randomizar respuestas
                </Label>
                <p className="text-xs text-gray-500">
                  Las opciones de respuesta aparecerán en orden aleatorio para cada estudiante
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lectura (solo si tipo === "lectura") */}
        {data.tipo === 'lectura' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-blue-200 dark:border-blue-800">
            <Label htmlFor="reading" className="text-base font-semibold flex items-center gap-2">
              📖 Texto de Lectura <span className="text-xs font-normal text-red-600">(Obligatorio)</span>
            </Label>
            <Textarea
              id="reading"
              value={data.contenido.reading || ''}
              onChange={e => setData('contenido', { ...data.contenido, reading: e.target.value })}
              rows={8}
              className="mt-2 font-serif text-base leading-relaxed"
            />
            <InputError message={errors['contenido.reading' as keyof typeof errors]} />
          </div>
        )}

        {/* Preguntas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 z-0!">
          <div className="flex justify-between items-center sticky top-0 bg-white pb-6 pt-4 dark:bg-gray-800 z-0!">
            <h3 className="text-lg font-semibold">Preguntas del Quiz</h3>
            <Button type="button" onClick={addQuestion} variant="outline">
              <Plus size={16} className="mr-1" /> Agregar Pregunta
            </Button>
          </div>

          <InputError message={errors['contenido.questions' as keyof typeof errors]} />

          {data.contenido.questions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No hay preguntas en este quiz</p>
              <Button
                type="button"
                onClick={addQuestion}
                variant="link"
                className="mt-2"
              >
                <Plus size={16} className="mr-1" /> Agregar primera pregunta
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {data.contenido.questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex justify-between items-start">
                    <Label className="text-base font-semibold">Pregunta {qIndex + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor={`question-${qIndex}`} className="text-sm">
                      Texto de la pregunta *
                    </Label>
                    <Textarea
                      id={`question-${qIndex}`}
                      value={question.text}
                      onChange={e => updateQuestionText(qIndex, e.target.value)}
                      placeholder="Escribe la pregunta..."
                      rows={2}
                      className={getQuestionError(qIndex, 'text') ? 'border-red-500' : ''}
                    />
                    <InputError message={getQuestionError(qIndex, 'text')} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Opciones de respuesta *</Label>
                      <Button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus size={14} className="mr-1" /> Opción
                      </Button>
                    </div>

                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`correct-${qIndex}-${optIndex}`}
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === optIndex}
                          onChange={() => setCorrectAnswer(qIndex, optIndex)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <Input
                            value={option}
                            onChange={e => updateOption(qIndex, optIndex, e.target.value)}
                            placeholder={`Opción ${optIndex + 1}`}
                            className={getOptionError(qIndex, optIndex) ? 'border-red-500' : ''}
                          />
                          <InputError message={getOptionError(qIndex, optIndex)} />
                        </div>
                        <span className="text-xs text-gray-500 min-w-[80px]">
                          {question.correctAnswer === optIndex && '✅ Correcta'}
                        </span>
                        {question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t pb-20">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={processing}
            className="bg-green-600 hover:bg-green-700"
          >
            {processing ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </ContentLayout>
  );
}