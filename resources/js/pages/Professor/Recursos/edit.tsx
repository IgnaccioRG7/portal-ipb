import ContentLayout from '@/layouts/content-layout'
import { useForm, Head } from '@inertiajs/react'
import cursos from '@/routes/cursos'

export default function Edit({ curso, modulo, materia, recurso }: any) {

  const { data, setData, post, processing, errors } = useForm({
    titulo: recurso.titulo || '',
    descripcion: recurso.descripcion || '',
    archivo: null as File | null,
    _method: 'put'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    post(
      cursos.recursos.update({
        curso: curso.id,
        modulo: modulo.id,
        materia: materia.id,
        recurso: recurso.id
      }).url,
      {
        forceFormData: true
      }
    )
  }

  return (
    <ContentLayout
      title="Editar recurso"
      subtitle={materia.nombre}
    >
      <Head title="Editar recurso" />

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Título</label>
          <input
            type="text"
            value={data.titulo}
            onChange={e => setData('titulo', e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.titulo && <p className="text-red-500">{errors.titulo}</p>}
        </div>

        <div>
          <label>Descripción</label>
          <input
            type="text"
            value={data.descripcion}
            onChange={e => setData('descripcion', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Reemplazar archivo (opcional)</label>
          <input
            type="file"
            onChange={e => setData('archivo', e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Actualizar
        </button>

      </form>
    </ContentLayout>
  )
}