import { ContenidoJson, Quiz } from "@/components/student/quiz";
import { generarOpciones, SelectorCantidad } from "@/components/student/selector-cantidad";
import ContentLayout from "@/layouts/content-layout";
import { dashboard } from "@/routes";
import estudiante from "@/routes/estudiante";
import { useHydration, useQuizStore } from "@/store/quiz";
import { BreadcrumbItem } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ArrowLeftToLine } from "lucide-react";
import { useEffect, useRef } from "react";
import { navigationGuard } from '@/lib/navigation-guard'

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Materia {
  id: number;
  nombre: string;
  area: string;
}

interface Tema {
  id: number;
  nombre: string | null;
  descripcion: string | null;
  orden: number;
  tipo: 'opcional' | 'lectura' | 'configurable';
  estado: 'activo' | string;
  contenido_json: string;
  curso_materia_tema_id: number;
  curso_materia_id: number;
  modulo_id: number;
  randomizar_preguntas: boolean;
  randomizar_respuestas: boolean;
}

interface TopicProps {
  curso: Curso;
  materia: Materia;
  tema: Tema;
}

export default function Topic({ curso, materia, tema }: TopicProps) {
  const { subjectId, setSubjectId, reset, cantidadPreguntas, setCantidadPreguntas, shuffledQuestions, setShuffledQuestions } = useQuizStore()
  const title = tema.nombre ? tema.nombre : materia.nombre
  const contenido = JSON.parse(tema.contenido_json)
  const totalPreguntas = contenido.questions?.length ?? 0
  const opcionesPreguntas = generarOpciones(totalPreguntas)
  const mountedRef = useRef(false)

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: dashboard().url },
    { title: 'Materias', href: estudiante.subjects(curso.id).url },
    { title: 'Temas', href: '#' }
  ];

  // Si cambia el tema o es la primera vez, resetear y asignar el nuevo subjectId
  useEffect(() => {
    // Si estamos navegando fuera, no re-asignar subjectId
    console.log("VALOR IS NAVIGATING AWAT");
    console.log(navigationGuard.isNavigatingAway);

    if (navigationGuard.isNavigatingAway) return

    if (subjectId !== tema.id) {
      reset()
      setSubjectId(tema.id)
    }
  }, [tema.id, subjectId])

  // Interceptar navegación para confirmar salida y resetear
  useEffect(() => {
    // Solo limpiar el guard en el PRIMER montaje real del componente
    // no en remontajes intermedios de Inertia
    if (!mountedRef.current) {
      mountedRef.current = true
      // NO limpiar aquí todavía
    }

    let yaConfirmo = false

    const unsubscribeInertia = router.on('before', (event) => {
      const nuevaRuta = event.detail.visit.url.href
      const rutaActual = window.location.href

      console.log("VERIFICANDO QUE YA CONFIRMO");
      console.log(yaConfirmo);

      if (nuevaRuta === rutaActual) return
      if (useQuizStore.getState().isSubmitting) return
      if (event.detail.visit.prefetch) return
      if (yaConfirmo) return

      const confirmar = window.confirm('¿Estás seguro que deseas salir? Perderás todo el progreso del examen.')

      if (!confirmar) {
        event.preventDefault()
        return
      }

      yaConfirmo = true
      navigationGuard.setNavigatingAway(true)
      useQuizStore.getState().reset()
    })

    const handlePopState = () => {
      if (useQuizStore.getState().isSubmitting) return

      const confirmar = window.confirm('¿Estás seguro que deseas salir? Perderás todo el progreso del examen.')

      if (!confirmar) {
        // window.history.pushState(null, '', window.location.href)
        window.history.pushState({ quizIntercepted: true }, '', window.location.href)
        return
      }

      yaConfirmo = true
      navigationGuard.setNavigatingAway(true)
      useQuizStore.getState().reset()
      console.log("Reseteando el quiz");
      console.log(useQuizStore.getState().shuffledQuestions);

      router.visit(estudiante.subjects({ course: curso.id }))
    }

    if (!window.history.state?.quizIntercepted) {
      window.history.pushState({ quizIntercepted: true }, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      unsubscribeInertia()
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  if (tema.tipo === 'configurable' && !cantidadPreguntas) {
    return (
      <ContentLayout breadcrumbs={breadcrumbs}>
        <SelectorCantidad
          opciones={opcionesPreguntas}
          onSeleccionar={setCantidadPreguntas}
          curso={curso}
          title={title}
        />
      </ContentLayout>
    )
  }

  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <section className="quiz flex flex-col gap-4">
        <header className="flex flex-row items-center gap-2 relative">
          <Link
            className="absolute left-0 flex flex-row gap-2"
            href={estudiante.subjects({ course: curso.id })}
          >
            <ArrowLeftToLine className="size-6" />
            <span className="hidden md:block">Salir</span>
          </Link>
          <h2 className="text-2xl font-bold w-full text-center">Resuelve la prueba de: {title}</h2>
        </header>
        <Quiz
          tema={tema}
          cursoId={curso.id}
          moduloId={tema.modulo_id}
          materiaId={materia.id}
        />
      </section>
    </ContentLayout>
  )
}