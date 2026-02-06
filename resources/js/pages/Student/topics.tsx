import { Quiz } from "@/components/student/quiz";
import ContentLayout from "@/layouts/content-layout";
import { dashboard } from "@/routes";
import estudiante from "@/routes/estudiante";
import { useQuizStore } from "@/store/quiz";
import { BreadcrumbItem } from "@/types";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

// Curso
export interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

// Materia
export interface Materia {
  id: number;
  nombre: string;
  area: string;
}

// Tema
export interface Tema {
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

// Props del componente Topics
export interface TopicsProps {
  curso: Curso;
  materia: Materia;
  temas: Tema[];
  matricula: string | null;
}

export default function Topics({
  curso,
  materia,
  temas,
  matricula
}: TopicsProps) {
  console.log(temas);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: dashboard().url },
    { title: 'Materias', href: estudiante.subjects(curso.id).url },
    { title: 'Temas', href: '#' }
  ];

  const shouldRedirect =
    temas.length === 1;

  useEffect(() => {
    if (shouldRedirect) {
      router.visit(
        estudiante.topic({
          curso: curso.id,
          materia: materia.id,
          tema: temas[0].id
        }).url
      );
    }
  }, [shouldRedirect]);

  if (shouldRedirect) {
    return <ContentLayout breadcrumbs={breadcrumbs}>
      <section className="w-full h-full flex flex-col gap-2">
        <div className="title w-full max-w-80 h-8 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="title w-full h-8 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="title w-full max-w-160 h-8 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="title w-full h-12 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="title w-full h-12 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="title w-full h-12 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="title w-full h-12 animate-pulse bg-gray-100/10 rounded-md"></div>
        <div className="buttons flex justify-between mt-4">
          <div className="title w-full max-w-40 h-8 animate-pulse bg-gray-100/10 rounded-md"></div>
          <div className="title w-full max-w-40 h-8 animate-pulse bg-gray-100/10 rounded-md"></div>
        </div>
      </section>
    </ContentLayout>;
  }  

  // Varios temas
  return (
    <ContentLayout breadcrumbs={breadcrumbs}>
      <section className="topics space-y-4">
        <h2 className="text-xl font-semibold">
          Selecciona un tema
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {temas.map((tema) => (
            <Link
              key={tema.id}
              href={estudiante.topic({
                curso: curso.id,
                materia: materia.id,
                tema: tema.id
              }).url}
            >
              <li
                className="p-4 border rounded-lg hover:shadow cursor-pointer"
              >
                <h3 className="font-medium">
                  {tema.nombre ?? 'Tema'}
                </h3>

                {tema.descripcion && (
                  <p className="text-sm text-gray-500">
                    {tema.descripcion}
                  </p>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </section>
    </ContentLayout>
  );
}
