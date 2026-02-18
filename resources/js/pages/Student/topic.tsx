import { ContenidoJson, Quiz } from "@/components/student/quiz";
import { generarOpciones, SelectorCantidad } from "@/components/student/selector-cantidad";
import ContentLayout from "@/layouts/content-layout";
import { dashboard } from "@/routes";
import estudiante from "@/routes/estudiante";
import { useQuizStore } from "@/store/quiz";
import { BreadcrumbItem } from "@/types";
import { Link } from "@inertiajs/react";
import { ArrowLeftToLine, CircleCheck, CircleX, RotateCcw, Home, Trophy } from "lucide-react";
import { useEffect } from "react";

// Curso
interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

// Materia
interface Materia {
  id: number;
  nombre: string;
  area: string;
}

// Tema
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

// Props del componente Topic
interface TopicProps {
  curso: Curso;
  materia: Materia;
  tema: Tema;
}

//TODO: arreglar que cuando de click en salir o que cuando cambie de pestania reiniciar el quiz y que pierda todo el progreso
export default function Topic({
  curso,
  materia,
  tema
}: TopicProps) {
  console.log(tema);
  const { isCompleteQuiz, subjectId, setSubjectId, reset, cantidadPreguntas, setCantidadPreguntas, setShuffledQuestions } = useQuizStore()
  const title = tema.nombre ? tema.nombre : materia.nombre
  const contenido = JSON.parse(tema.contenido_json)
  const totalPreguntas = contenido.questions?.length ?? 0

  const opcionesPreguntas = generarOpciones(totalPreguntas)

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: dashboard().url },
    { title: 'Materias', href: estudiante.subjects(curso.id).url },
    { title: 'Temas', href: '#' }
  ];

  useEffect(() => {
    if (subjectId !== tema?.id) {
      reset()
      setSubjectId(tema.id)
    }

    return () => {
      // setCantidadPreguntas(null)
      // setShuffledQuestions([])

      // if (tema.tipo === 'configurable') {      
      //   reset()
      // }
    }

  }, [tema.id])

  console.log(tema.tipo);

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
            href={estudiante.subjects({
              course: curso.id,
            })}
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