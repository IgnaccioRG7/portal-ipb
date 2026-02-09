import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Cursos',
    href: admin.cursos.index().url
  },
  {
    title: 'Crear Curso',
    href: admin.cursos.create().url,
  },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    codigo_curso: '',
    nombre: '',
    descripcion: '',
    nivel: 'básico',
    duracion_semanas: '',
    horas_semanales: '5',
    precio: '0',
    capacidad_maxima: '30',
    estado: 'activo',
    fecha_inicio: '',
    fecha_fin: '',
    requisitos: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(admin.cursos.store().url);
  };

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title="Crear Curso"
      subtitle="Registra un nuevo curso en la plataforma"
    >
      <Head title="Crear Curso" />

      <section className="pt-0 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={submit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Información Básica</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="codigo_curso">Código del Curso *</Label>
                    <Input
                      id="codigo_curso"
                      value={data.codigo_curso}
                      onChange={e => setData('codigo_curso', e.target.value)}
                      placeholder="Ej: ESFM-UAS"
                      required
                    />
                    <InputError message={errors.codigo_curso} />
                  </div>

                  <div>
                    <Label htmlFor="nombre">Nombre del Curso *</Label>
                    <Input
                      id="nombre"
                      value={data.nombre}
                      onChange={e => setData('nombre', e.target.value)}
                      placeholder="Ej: ESFM - UAS"
                      required
                    />
                    <InputError message={errors.nombre} />
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={data.descripcion}
                      onChange={e => setData('descripcion', e.target.value)}
                      placeholder="Describe el curso"
                      rows={4}
                    />
                    <InputError message={errors.descripcion} />
                  </div>

                  <div>
                    <Label htmlFor="nivel">Nivel *</Label>
                    <Select value={data.nivel} onValueChange={(value) => setData('nivel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                        <SelectItem value="especializado">Especializado</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.nivel} />
                  </div>

                  <div>
                    <Label htmlFor="requisitos">Requisitos</Label>
                    <Textarea
                      id="requisitos"
                      value={data.requisitos}
                      onChange={e => setData('requisitos', e.target.value)}
                      placeholder="Requisitos previos para el curso"
                      rows={3}
                    />
                    <InputError message={errors.requisitos} />
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Configuración</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duracion_semanas">Duración (semanas)</Label>
                      <Input
                        id="duracion_semanas"
                        type="number"
                        value={data.duracion_semanas}
                        onChange={e => setData('duracion_semanas', e.target.value)}
                        placeholder="12"
                        min="1"
                      />
                      <InputError message={errors.duracion_semanas} />
                    </div>

                    <div>
                      <Label htmlFor="horas_semanales">Horas/Semana *</Label>
                      <Input
                        id="horas_semanales"
                        type="number"
                        value={data.horas_semanales}
                        onChange={e => setData('horas_semanales', e.target.value)}
                        required
                        min="1"
                        max="40"
                      />
                      <InputError message={errors.horas_semanales} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precio">Precio (Bs) *</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        value={data.precio}
                        onChange={e => setData('precio', e.target.value)}
                        required
                        min="0"
                      />
                      <InputError message={errors.precio} />
                    </div>

                    <div>
                      <Label htmlFor="capacidad_maxima">Capacidad Máxima *</Label>
                      <Input
                        id="capacidad_maxima"
                        type="number"
                        value={data.capacidad_maxima}
                        onChange={e => setData('capacidad_maxima', e.target.value)}
                        required
                        min="1"
                      />
                      <InputError message={errors.capacidad_maxima} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={data.estado} onValueChange={(value) => setData('estado', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="completo">Completo</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.estado} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                      <Input
                        id="fecha_inicio"
                        type="date"
                        value={data.fecha_inicio}
                        onChange={e => setData('fecha_inicio', e.target.value)}
                      />
                      <InputError message={errors.fecha_inicio} />
                    </div>

                    <div>
                      <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                      <Input
                        id="fecha_fin"
                        type="date"
                        value={data.fecha_fin}
                        onChange={e => setData('fecha_fin', e.target.value)}
                        min={data.fecha_inicio}
                      />
                      <InputError message={errors.fecha_fin} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4 justify-end border-t pt-4">
              <Link
                href={admin.cursos.index().url}
                className="text-sm text-gray-600 hover:text-gray-900 underline dark:text-gray-200"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="bg-green-600 text-white hover:bg-green-500"
              >
                {processing ? 'Creando...' : 'Crear Curso y Asignar Materias →'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </ContentLayout>
  );
}