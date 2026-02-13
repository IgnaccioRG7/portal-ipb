import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Materias',
    href: admin.materias.index().url,
  },
  {
    title: 'Crear materia',
    href: admin.materias.create().url,
  },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    codigo_materia: '',
    nombre: '',
    descripcion: '',
    // area: 'general',
    // color: '#1e88e5',
    objetivos_generales: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(admin.materias.store().url);
  };

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title="Crear Materia"
      subtitle="Registra una nueva materia en el sistema"
    >
      <section className="form pt-0 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={submit} className="space-y-6">
            {/* DATOS BÁSICOS */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2">Datos Básicos</h3>

              <div className="grid gap-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="codigo_materia">Código de Materia *</Label>
                    <Input
                      id="codigo_materia"
                      value={data.codigo_materia}
                      onChange={(e) => setData('codigo_materia', e.target.value)}
                      required
                      placeholder="Ej: MAT-101"
                    />
                    <InputError message={errors.codigo_materia} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={data.nombre}
                      onChange={(e) => setData('nombre', e.target.value)}
                      required
                      placeholder="Ej: Matemáticas Básicas"
                    />
                    <InputError message={errors.nombre} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <textarea
                    id="descripcion"
                    value={data.descripcion}
                    onChange={(e) => setData('descripcion', e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Descripción breve de la materia"
                  />
                  <InputError message={errors.descripcion} />
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="area">Área *</Label>
                    <select
                      id="area"
                      value={data.area}
                      onChange={(e) => setData('area', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="general">General</option>
                      <option value="ciencias">Ciencias</option>
                      <option value="lenguaje">Lenguaje</option>
                      <option value="especifica">Específica</option>
                    </select>
                    <InputError message={errors.area} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="color">Color Identificador *</Label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        id="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="h-10 w-20 rounded border border-input cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        placeholder="#1e88e5"
                        className="flex-1"
                      />
                    </div>
                    <InputError message={errors.color} />
                  </div>
                </div> */}

                <div className="grid gap-2">
                  <Label htmlFor="objetivos_generales">Objetivos Generales</Label>
                  <textarea
                    id="objetivos_generales"
                    value={data.objetivos_generales}
                    onChange={(e) => setData('objetivos_generales', e.target.value)}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Objetivos que se esperan alcanzar con esta materia"
                  />
                  <InputError message={errors.objetivos_generales} />
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-4 justify-end">
              <Link
                href={admin.materias.index().url}
                className="text-sm text-gray-600 hover:text-gray-900 underline dark:text-gray-200"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="cursor-pointer bg-green-600 text-white hover:bg-green-500 transition-colors duration-300"
              >
                {processing ? 'Creando...' : 'Crear Materia'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </ContentLayout>
  );
}