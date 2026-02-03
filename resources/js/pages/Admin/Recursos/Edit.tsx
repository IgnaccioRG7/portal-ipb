import ContentLayout from '@/layouts/content-layout';
import { Head, useForm } from '@inertiajs/react';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Recursos',
    href: admin.recursos.index().url
  },
  {
    title: 'Editar recurso',
    href: '#',
  },
];

export default function RecursoEdit({ auth, recurso }) {
  const { data, setData, post, processing, errors } = useForm({
    titulo: recurso.titulo,
    descripcion: recurso.descripcion || '',
    archivo: null,
    visible: recurso.visible,
    _method: 'PUT',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(admin.recursos.update(recurso.id));
  };

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title='Edita un Recurso'
      subtitle='Modifica un recurso en la pagina de inicio'
    >
      <Head title="Editar Recurso" />

      <div className="py-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título *
            </label>
            <input
              type="text"
              value={data.titulo}
              onChange={(e) => setData('titulo', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          {/* Archivo actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo actual
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{recurso.nombre_original}</span>
              <a
                href={recurso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Ver archivo
              </a>
            </div>
          </div>

          {/* Nuevo archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reemplazar archivo (opcional)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setData('archivo', e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
            />
            {errors.archivo && (
              <p className="mt-1 text-sm text-red-600">{errors.archivo}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Máximo 10MB. Solo archivos PDF.
            </p>
          </div>

          {/* Visible */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.visible}
              onChange={(e) => setData('visible', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Visible públicamente
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <a
              href={admin.recursos.index().url}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Actualizando...' : 'Actualizar Recurso'}
            </button>
          </div>
        </form>
      </div>
    </ContentLayout>
  );
}