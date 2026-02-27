import ContentLayout from '@/layouts/content-layout'
import { Link, router, Head } from '@inertiajs/react'
import cursos from '@/routes/cursos'
import { useState } from 'react'
import {
  FileText,
  Image,
  Download,
  Eye,
  Trash2,
  X,
  File,
  Lock,
  Pencil
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'

// Types
interface Recurso {
  id: number
  modulo_materia_id: number
  titulo: string
  descripcion: string | null
  tipo: string
  url: string
  visibilidad: 'privado' | 'publico'
  descargas: number
  estado: 'activo' | 'inactivo'
  created_at: string
  updated_at: string
}

interface Props {
  curso: any
  modulo: any
  materia: any
  recursos: Recurso[]
}

// Helper functions
const isImage = (tipo: string) => tipo?.startsWith('image/')
const isPdf = (tipo: string) => tipo === 'application/pdf'

// File icon component
const FileIcon = ({ tipo }: { tipo: string }) => {
  if (isImage(tipo)) {
    return <Image className="w-8 h-8 text-blue-500" />
  }
  if (isPdf(tipo)) {
    return <FileText className="w-8 h-8 text-red-500" />
  }
  return <File className="w-8 h-8 text-gray-500" />
}

export default function Index({ curso, modulo, materia, recursos }: Props) {
  console.log(recursos);
  

  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleDelete = (id: number, titulo: string) => {
    if (confirm(`¿Estás seguro de eliminar el recurso "${titulo}"?`)) {
      router.delete(
        // ✅ CORRECTO: destroy() ya retornaba string directamente (según tu código original)
        cursos.recursos.destroy({
          curso: curso.id,
          modulo: modulo.id,
          materia: materia.id,
          recurso: id
        })
      )
    }
  }

  const handlePreview = (recurso: Recurso) => {
    setSelectedRecurso(recurso)
    setPreviewOpen(true)
  }

  // Helper para construir URL de preview con cache-busting
  const buildPreviewUrl = (recurso: Recurso) =>
    cursos.recursos.preview({
      curso: curso.id,
      modulo: modulo.id,
      materia: materia.id,
      recurso: recurso.id
    }).url + '?t=' + recurso.updated_at  // ✅ ?t= rompe el caché del browser

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
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          + Nuevo recurso
        </Link>
      }
    >
      <Head title={`Recursos - ${materia.nombre}`} />

      {/* Modal de previsualización */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen} aria-describedby={undefined}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedRecurso?.titulo}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {selectedRecurso && (
              <>
                {isImage(selectedRecurso.tipo) && (
                  <img
                    src={buildPreviewUrl(selectedRecurso)}  // ✅ usa helper con ?t=
                    alt={selectedRecurso.titulo}
                    className="max-w-full max-h-[70vh] mx-auto rounded"
                  />
                )}

                {isPdf(selectedRecurso.tipo) && (
                  <iframe
                    src={buildPreviewUrl(selectedRecurso)}  // ✅ CORREGIDO: también tenía caché el PDF
                    className="w-full h-[70vh] border rounded"
                    title={selectedRecurso.titulo}
                  />
                )}

                {!isImage(selectedRecurso.tipo) && !isPdf(selectedRecurso.tipo) && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <File className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">
                      No hay vista previa disponible para este tipo de archivo
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {selectedRecurso?.descripcion && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedRecurso.descripcion}
              </p>
            </div>
          )}

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {recursos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700">
          <File className="w-12 h-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay recursos</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comienza agregando un nuevo recurso a esta materia.
          </p>
          <div className="mt-6">
            <Link
              href={cursos.recursos.create({
                curso: curso.id,
                modulo: modulo.id,
                materia: materia.id
              })}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800"
            >
              + Agregar recurso
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recursos.map((recurso) => {
            const previewUrl = buildPreviewUrl(recurso)  // ✅ usa helper con ?t=

            return (
              <div
                key={recurso.id}
                className="relative flex flex-col overflow-hidden transition-all duration-200 bg-white border rounded-lg shadow-sm hover:shadow-md dark:bg-gray-900 dark:border-gray-800"
              >
                {/* Preview thumbnail */}
                <div
                  className="relative h-20 overflow-hidden bg-gray-100 cursor-pointer dark:bg-gray-800 group"
                  onClick={() => handlePreview(recurso)}
                >
                  {isImage(recurso.tipo) ? (
                    <img
                      src={previewUrl}
                      alt={recurso.titulo}
                      className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : isPdf(recurso.tipo) ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <FileText className="w-16 h-16 text-red-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <File className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-0 group-hover:bg-opacity-30">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate dark:text-gray-100" title={recurso.titulo}>
                        {recurso.titulo}
                      </h3>
                      {recurso.descripcion && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
                          {recurso.descripcion}
                        </p>
                      )}
                    </div>
                    <FileIcon tipo={recurso.tipo} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(recurso)}
                        className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        title="Vista previa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={cursos.recursos.download({
                          curso: curso.id,
                          modulo: modulo.id,
                          materia: materia.id,
                          recurso: recurso.id
                        }).url}
                        className="inline-flex items-center p-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => router.visit(cursos.recursos.edit({  // ✅ CORREGIDO: .url al final
                          curso: curso.id,
                          materia: materia.id,
                          modulo: modulo.id,
                          recurso: recurso.id
                        }).url)}
                        className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-cyan-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-cyan-800 dark:hover:bg-gray-700 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(recurso.id, recurso.titulo)}
                      className="inline-flex items-center p-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:text-red-300 dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status badge */}
                {recurso.visibilidad === 'privado' && (
                  <span className="absolute px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-br-lg top-2 left-2 dark:text-yellow-200 dark:bg-yellow-900 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Privado
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </ContentLayout>
  )
}