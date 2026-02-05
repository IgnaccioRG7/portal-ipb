import { Quiz } from "@/components/student/quiz";
import ContentLayout from "@/layouts/content-layout";
import { dashboard } from "@/routes";
import estudiante from "@/routes/estudiante";
import { BreadcrumbItem } from "@/types";
import { Link } from "@inertiajs/react";
import { ArrowLeftToLine } from "lucide-react";

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
}

// Props del componente Topic
interface TopicProps {
  curso: Curso;
  materia: Materia;
  tema: Tema;
}


export default function Topic({
  curso,
  materia,
  tema
}: TopicProps) {
  console.log(tema);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: dashboard().url },
    { title: 'Materias', href: estudiante.subjects(curso.id).url },
    { title: 'Temas', href: '#' }
  ];

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
          <h2 className="text-2xl font-bold w-full text-center">Resuelve la prueba de: {tema.nombre}</h2>
        </header>
        <Quiz tema={tema} />
      </section>
    </ContentLayout>
  )
}