import estudiante from "@/routes/estudiante"
import { Link } from "@inertiajs/react"
import { ArrowLeftToLine } from "lucide-react"

export function generarOpciones(total: number): number[] {
  // Genera opciones dinámicas según el total
  // ej: total=50 → [10, 25, 50]
  // ej: total=20 → [5, 10, 20]
  // ej: total=8  → [8] (menos de 10, solo la opción completa)
  
  const opciones: number[] = []
  const rangos = [5, 10, 15, 20, 25, 30, 40, 50, 70, 90, 100]
  
  for (const rango of rangos) {
    if (rango < total) opciones.push(rango)
  }
  
  opciones.push(total) // siempre incluir el total completo
  return opciones
}

interface SelectorCantidadProps {
  opciones: number[]
  onSeleccionar: (n: number) => void
  curso: { id: number }
  title: string
}

export function SelectorCantidad({ opciones, onSeleccionar, curso, title }: SelectorCantidadProps) {
  return (
    <section className="flex flex-col gap-6 mx-auto mt-8">
      <header className="flex flex-row items-center gap-2 relative">
        <Link
          className="absolute left-0 flex flex-row gap-2"
          href={estudiante.subjects({ course: curso.id })}
        >
          <ArrowLeftToLine className="size-6" />
          <span className="hidden md:block">Salir</span>
        </Link>
        <h2 className="text-2xl font-bold w-full text-center">
          {title}
        </h2>
      </header>

      <p className="text-center text-gray-500">
        ¿Cuántas preguntas deseas resolver?
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {opciones.map(n => (
          <li key={n}>
            <button
              onClick={() => onSeleccionar(n)}
              className="w-full py-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl font-bold transition-colors"
            >
              {n}
              <span className="block text-sm font-normal text-gray-400">preguntas</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}