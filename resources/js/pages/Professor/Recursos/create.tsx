import ContentLayout from '@/layouts/content-layout'
import { Head, router, useForm } from '@inertiajs/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import cursos from '@/routes/cursos'

export default function Create({ curso, modulo, materia }: any) {

  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    archivo: null as File | null,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    router.post(
      cursos.recursos.store({
        curso: curso.id,
        modulo: modulo.id,
        materia: materia.id
      })
    )
  }

  return (
    <ContentLayout
      title={`Nuevo Recurso - ${materia.nombre}`}
      subtitle={`Curso: ${curso.nombre}`}
    >
      <Head title="Nuevo Recurso" />

      <form onSubmit={submit} className="space-y-6 max-w-xl">

        <div>
          <Label>Título</Label>
          <Input
            value={data.titulo}
            onChange={e => setData('titulo', e.target.value)}
          />
          {errors.titulo && <p className="text-red-600">{errors.titulo}</p>}
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea
            value={data.descripcion}
            onChange={e => setData('descripcion', e.target.value)}
          />
        </div>

        <div>
          <Label>Archivo</Label>
          <Input
            type="file"
            onChange={e => setData('archivo', e.target.files?.[0] || null)}
          />
          {errors.archivo && <p className="text-red-600">{errors.archivo}</p>}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {processing ? 'Subiendo...' : 'Guardar'}
        </button>

      </form>

    </ContentLayout>
  )
}