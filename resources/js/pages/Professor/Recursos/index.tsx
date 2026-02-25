import ContentLayout from '@/layouts/content-layout'
import { Link, router, Head } from '@inertiajs/react'
import cursos from '@/routes/cursos'

const isImage = (tipo: string) => tipo?.startsWith('image/')
const isPdf = (tipo: string) => tipo === 'application/pdf'

export default function Index({ curso, modulo, materia, recursos }: any) {

  console.log(recursos);
  

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar recurso?')) {
      router.delete(
        cursos.recursos.destroy({
          curso: curso.id,
          modulo: modulo.id,
          materia: materia.id,
          recurso: id
        })
      )
    }
  }

  return (
    <ContentLayout
      title={`Recursos - ${materia.nombre}`}
      subtitle={`Módulo: ${modulo.nombre}`}
      actions={
        <Link
          href={cursos.recursos.create({
            curso: curso.id,
            modulo: modulo.id,
            materia: materia.id
          })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Nuevo recurso
        </Link>
      }
    >
      <Head title={`Recursos - ${materia.nombre}`} />

      <div className="space-y-4">

        {recursos.length === 0 && (
          <div className="p-6 text-center border rounded bg-gray-50 dark:bg-gray-800 text-gray-500">
            No hay recursos disponibles.
          </div>
        )}

        {recursos.map((recurso: any) => {

          const previewUrl = cursos.recursos.preview({
            curso: curso.id,
            modulo: modulo.id,
            materia: materia.id,
            recurso: recurso.id
          }).url

          return (
            <div
              key={recurso.id}
              className="p-4 border rounded shadow-sm bg-white dark:bg-gray-900"
            >

              <div className="flex justify-between items-start">

                <div className="w-full">

                  <h3 className="font-bold text-lg">
                    {recurso.titulo}
                  </h3>

                  {recurso.descripcion && (
                    <p className="text-sm text-gray-500">
                      {recurso.descripcion}
                    </p>
                  )}

                  <p className="text-xs mt-1 text-gray-400">
                    Descargas: {recurso.descargas}
                  </p>

                  {/* PREVISUALIZACIÓN */}
                  <div className="mt-4">

                    {recurso.tipo?.startsWith('image/') && (
                      <img
                        src={previewUrl}
                        className="max-h-64 rounded border"
                      />
                    )}

                    {recurso.tipo === 'application/pdf' && (
                      <iframe
                        src={previewUrl}
                        className="w-full h-96 border rounded"
                      />
                    )}

                  </div>

                </div>

                <div className="flex flex-col gap-2 ml-4">

                  <a
                    href={previewUrl}
                    target="_blank"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Ver
                  </a>

                  <a
                    href={cursos.recursos.download({
                      curso: curso.id,
                      modulo: modulo.id,
                      materia: materia.id,
                      recurso: recurso.id
                    }).url}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Descargar
                  </a>

                  <button
                    onClick={() => handleDelete(recurso.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>

                </div>

              </div>
            </div>
          )
        })}

      </div>
    </ContentLayout>
  )
}