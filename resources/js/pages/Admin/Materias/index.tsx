import { DataTable } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import ContentLayout from '@/layouts/content-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { BookOpen, Edit, Trash2, Search, BookMarked, Languages, BookText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Stats {
  total: number;
  // ciencias: number;
  // lenguaje: number;
  // general: number;
}

interface Materia {
  id: number;
  codigo_materia: string;
  nombre: string;
  descripcion: string;
  area: string;
  color: string;
}

interface PaginatedMaterias {
  data: Materia[];
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface Filters {
  search: string;
  per_page: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Materias',
    href: admin.materias.index().url,
  },
];

const DEFAULT_VALUE_FILTERS = {
  search: '',
  per_page: 10,
};

export default function Index({
  materias,
  stats,
  filters = DEFAULT_VALUE_FILTERS,
}: {
  materias: PaginatedMaterias;
  stats: Stats;
  filters: Filters;
}) {
  const [search, setSearch] = useState(() => filters?.search);
  const debounceRef = useRef<any>(null);
  const [perPage, setPerPage] = useState<number>(() => filters.per_page);

  const handlePerPageChange = (results: number) => {
    setPerPage(results);

    if (results === DEFAULT_VALUE_FILTERS.per_page) {
      router.get(
        admin.materias.index().url,
        {},
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      );
    } else {
      router.get(
        admin.materias.index().url,
        {
          per_page: results,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      );
    }
  };

  const debounceSearch = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim() === '') {
        router.get(
          admin.materias.index().url,
          {},
          {
            preserveState: true,
            preserveScroll: true,
            replace: true,
          }
        );
      } else {
        router.get(
          admin.materias.index().url,
          { search: value },
          {
            preserveState: true,
            preserveScroll: true,
            replace: true,
          }
        );
      }
    }, 500);
  };

  const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debounceSearch(value);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleEdit = (materiaId: number) => {
    router.visit(admin.materias.edit(materiaId).url);
  };

  const handleDelete = (materiaId: number) => {
    if (confirm('¿Estás seguro de eliminar esta materia? Esta acción no se puede deshacer.')) {
      router.delete(admin.materias.destroy(materiaId).url, {
        preserveScroll: true,
        onSuccess: () => {
          console.log('Materia eliminada');
        },
      });
    }
  };

  // const getAreaLabel = (area: string) => {
  //   const areas: Record<string, string> = {
  //     ciencias: 'Ciencias',
  //     lenguaje: 'Lenguaje',
  //     general: 'General',
  //     especifica: 'Específica',
  //   };
  //   return areas[area] || area;
  // };

  const columns = [
    { key: 'codigo_materia', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripcion' },
    // {
    //   key: 'area',
    //   label: 'Área',
    //   render: (materia: Materia) => (
    //     <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
    //       {getAreaLabel(materia.area)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'color',
    //   label: 'Color',
    //   render: (materia: Materia) => (
    //     <div className="flex items-center gap-2">
    //       <div
    //         className="w-6 h-6 rounded border border-gray-300"
    //         style={{ backgroundColor: materia.color }}
    //       />
    //       <span className="text-xs text-gray-600 dark:text-gray-400">{materia.color}</span>
    //     </div>
    //   ),
    // },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (materia: Materia) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(materia.id)}
            className="flex items-center gap-1 p-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            title="Editar materia"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* <button
            onClick={() => handleDelete(materia.id)}
            className="flex items-center gap-1 p-2 text-sm rounded-md transition-colors bg-red-500 text-white hover:bg-red-600 cursor-pointer"
            title="Eliminar materia"
          >
            <Trash2 className="w-4 h-4" />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title="Materias"
      subtitle="Administra las materias del sistema educativo"
      actions={
        <>
          <Link
            href={admin.materias.create().url}
            className="flex gap-2 items-center bg-blue-900 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-800 transition-colors duration-300 text-white"
          >
            <BookOpen />
            Nueva Materia
          </Link>
        </>
      }
    >
      {/* Stats */}
      <section className="stats grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">Total</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
          <BookOpen />
        </div>
        {/* <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">Ciencias</div>
            <div className="text-xl font-bold text-green-600">{stats.ciencias}</div>
          </div>
          <BookMarked className="text-green-600" />
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">Lenguaje</div>
            <div className="text-xl font-bold text-blue-600">{stats.lenguaje}</div>
          </div>
          <Languages className="text-blue-600" />
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">General</div>
            <div className="text-xl font-bold text-purple-600">{stats.general}</div>
          </div>
          <BookText className="text-purple-600" />
        </div> */}
      </section>

      {/* Filters */}
      <section className="filters mb-6 flex gap-4 flex-wrap">
        <search className="border border-gray-200 shadow-xs dark:border-gray-600 rounded-full grow bg-gray-100 dark:bg-gray-700 basis-2xs shrink-0">
          <label htmlFor="search" className="flex gap-2 items-center py-1 pl-4">
            <Search className="size-5 text-gray-600 dark:text-gray-400" />
            <Input
              id="search"
              type="search"
              value={search}
              className="border-none px-0 pr-4 focus:outline-none! focus:border-none! ring-0! shadow-none"
              placeholder="Busca una materia por código o nombre"
              onChange={handleSearchText}
            />
          </label>
        </search>
        <div className="text-gray-200 flex gap-2 items-center">
          <span className="text-gray-500 dark:text-gray-400">Resultados:</span>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="bg-gray-100 text-gray-800 dark:bg-gray-600 border-none outline-none cursor-pointer p-2 rounded-md dark:text-gray-200"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </section>

      {/* Tabla */}
      <section className="table w-full">
        <DataTable columns={columns} data={materias.data} />
        <Pagination links={materias.links} />
      </section>
    </ContentLayout>
  );
}