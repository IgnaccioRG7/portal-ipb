// C:\Users\SMN\Downloads\dev\portal-ipb\resources\js\pages\Professor\Recursos\edit.tsx
import ContentLayout from '@/layouts/content-layout'
import { Head, useForm, router } from '@inertiajs/react'  // ✅ AÑADIDO: router
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import cursos from '@/routes/cursos'
import { useState } from 'react'
import { FileText, Image, File, X, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'

interface Props {
  curso: any
  modulo: any
  materia: any
  recurso: {
    id: number
    titulo: string
    descripcion: string | null
    tipo: string
    url: string
    visibilidad: 'privado' | 'publico'
    descargas: number
    estado: 'activo' | 'inactivo'
  }
}

// Helper functions
const isImage = (tipo: string) => tipo?.startsWith('image/')
const isPdf = (tipo: string) => tipo === 'application/pdf'

// File icon component
const FileIcon = ({ tipo }: { tipo: string }) => {
  if (isImage(tipo)) {
    return <Image className="w-12 h-12 text-blue-500" />
  }
  if (isPdf(tipo)) {
    return <FileText className="w-12 h-12 text-red-500" />
  }
  return <File className="w-12 h-12 text-gray-500" />
}

export default function Edit({ curso, modulo, materia, recurso }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  const { data, setData, post, processing, errors } = useForm({
    titulo: recurso.titulo,
    descripcion: recurso.descripcion || '',
    archivo: null as File | null,
    _method: 'PUT',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ CORREGIDO: extraer .url del objeto retornado por cursos.recursos.update
    const { url } = cursos.recursos.update({
      curso: curso.id,
      modulo: modulo.id,
      materia: materia.id,
      recurso: recurso.id
    })

    post(url, {
      forceFormData: true,
      onSuccess: () => {
        // ✅ CORREGIDO: router ya está importado arriba
        router.visit(cursos.recursos.index({
          curso: curso.id,
          modulo: modulo.id,
          materia: materia.id
        }).url)
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setData('archivo', file)
    setCurrentFile(file)
  }

  const removeNewFile = () => {
    setData('archivo', null)
    setCurrentFile(null)
    const fileInput = document.getElementById('archivo') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const previewUrl = cursos.recursos.preview({
    curso: curso.id,
    modulo: modulo.id,
    materia: materia.id,
    recurso: recurso.id
  }).url + '?t=' + recurso.updated_at

  return (
    <ContentLayout
      title={`Editar Recurso - ${materia.nombre}`}
      subtitle={`Curso: ${curso.nombre} | Módulo: ${modulo.nombre}`}
    >
      <Head title="Editar Recurso" />

      {/* Modal de previsualización */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {recurso.titulo}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {isImage(recurso.tipo) && (
              <img
                src={previewUrl}
                alt={recurso.titulo}
                className="max-w-full max-h-[70vh] mx-auto rounded"
              />
            )}

            {isPdf(recurso.tipo) && (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh] border rounded"
                title={recurso.titulo}
              />
            )}

            {!isImage(recurso.tipo) && !isPdf(recurso.tipo) && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <File className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No hay vista previa disponible para este tipo de archivo
                </p>
              </div>
            )}
          </div>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {/* Archivo actual */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Archivo actual
          </h3>

          <div className="flex items-center gap-4">
            <FileIcon tipo={recurso.tipo} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {recurso.url.split('/').pop()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tipo: {recurso.tipo} | Descargas: {recurso.descargas}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                Ver
              </Button>

              <a
                href={cursos.recursos.download({
                  curso: curso.id,
                  modulo: modulo.id,
                  materia: materia.id,
                  recurso: recurso.id
                }).url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800"
              >
                <Download className="w-4 h-4 mr-1" />
                Descargar
              </a>
            </div>
          </div>
        </div>

        {/* Nuevo archivo (opcional) */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Reemplazar archivo (opcional)
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="archivo">Seleccionar nuevo archivo</Label>
              <Input
                id="archivo"
                type="file"
                onChange={handleFileChange}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Máximo 20MB. Si no seleccionas un archivo, se mantendrá el actual.
              </p>
              {errors.archivo && (
                <p className="text-sm text-red-600 mt-1">{errors.archivo}</p>
              )}
            </div>

            {currentFile && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <File className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={removeNewFile}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Información del recurso */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={data.titulo}
              onChange={e => setData('titulo', e.target.value)}
              className="mt-1"
            />
            {errors.titulo && (
              <p className="text-sm text-red-600 mt-1">{errors.titulo}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={data.descripcion}
              onChange={e => setData('descripcion', e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.visit(cursos.recursos.index({
              curso: curso.id,
              modulo: modulo.id,
              materia: materia.id
            }).url)}  // ✅ CORREGIDO: .url al final
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={processing}
          >
            {processing ? 'Actualizando...' : 'Actualizar Recurso'}
          </Button>
        </div>
      </form>
    </ContentLayout>
  )
}