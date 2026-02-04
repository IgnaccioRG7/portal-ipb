import { DataTable } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { UserPlus, Edit, ShieldOff, Users, UserRoundCheck, UserRoundX, Search, ListFilter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Stats {
  total: number;
  activos: number;
  inactivos: number;
}

interface User {
  id: number;
  nombre_completo: string;
  email: string;
  rol: string;
  estado: string;
  // created_at: string;
}

interface PaginatedUsers {
  data: User[];
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface Filters {
  search: string,
  per_page: number
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: dashboard().url,
  },
];

const DEFAULT_VALUE_FILTERS = {
  search: '',
  per_page: 4
}

export default function Index({
  users,
  stats,
  filters = DEFAULT_VALUE_FILTERS
}:
  {
    users: PaginatedUsers,
    stats: Stats,
    filters: Filters
  }) {
  const [search, setSearch] = useState(() => {
    return filters?.search
  })
  const debounceRef = useRef<any>(null)
  const [perPage, setPerPage] = useState<number>(() => {
    return filters.per_page
  })

  // console.log(users);

  // Filtrando datos por pagina
  const handlePerPageChange = (results: number) => {
    setPerPage(results);

    if (results === DEFAULT_VALUE_FILTERS.per_page) {
      router.get(admin.users.index(), {}, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    } else {
      router.get(admin.users.index(), {
        per_page: results
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }
  }

  // Filtrando datos por el buscador
  // 1. Función de debounce independiente (NO dentro de useEffect)
  const debounceSearch = (value: string) => {
    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim() === '') {
        // Si está vacío, quitar el parámetro search de la URL
        router.get(admin.users.index(), {}, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        });
      } else {
        // Si tiene valor, buscar con el parámetro
        router.get(admin.users.index(), { search: value }, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        });
      }
    }, 500);
  };

  // 2. Handler para el input
  const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value); // Actualizar estado inmediato (para mostrar)

    // Llamar al debounce
    debounceSearch(value);
  };

  // 3. Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSearch = (newFilters: Filters) => {
    const params:any = {}
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key as keyof Filters] !== DEFAULT_VALUE_FILTERS[key as keyof Filters]) {
        params[key] = newFilters[key as keyof Filters]
      }
    })

    router.get(admin.users.index(), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    })
  }

  const handleEdit = (userId: number) => {
    // Redirigir a la página de edición
    router.visit(admin.users.edit(userId));
  };

  const handleDelete = (userId: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      router.delete(admin.users.destroy(userId), {
        preserveScroll: true,
        onSuccess: () => {
          // Aquí podrías agregar un toast de éxito si lo deseas
          console.log('Usuario eliminado');
        }
      });
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre_completo', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    {
      key: 'estado',
      label: 'Estado',
      render: (user: User) => (
        <span className={`w-2 h-2 block rounded-full text-xs ${user.estado === 'activo' ? 'bg-green-500' :
          user.estado === 'inactivo' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
          {/* {user.estado} */}
        </span>
      )
    },
    // { key: 'created_at', label: 'Registro' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(user.id)}
            className="flex items-center gap-1 p-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            title="Editar usuario"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDelete(user.id)}
            className={`flex items-center gap-1 p-2 text-sm rounded-md transition-colors bg-red-500 text-white hover:bg-red-600 cursor-pointer`}
            title='Eliminar usuario'
          >
            <ShieldOff className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title='Usuarios'
      subtitle='Administra roles, accesos y perfiles de la institución'
      actions={
        <>
          <Link
            href={admin.users.create()}
            className='flex gap-2 items-center bg-blue-900 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-800 transition-colors duration-300 text-white '>
            <UserPlus />
            Nuevo Usuario
          </Link>
        </>
      }
    >
      {/* Stats */}
      <section className="stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">Total</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
          <Users />
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">Activos</div>
            <div className="text-xl font-bold text-green-600">{stats.activos}</div>
          </div>
          <UserRoundCheck className='text-green-600' />
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 flex justify-between items-center">
          <div className="content flex flex-row-reverse items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300">Inactivos</div>
            <div className="text-xl font-bold text-red-500">{stats.inactivos}</div>
          </div>
          <UserRoundX className='text-red-500' />
        </div>
      </section>

      {/* Filters */}
      <section className="filters mb-6 flex gap-4 flex-wrap">
        <search className='border border-gray-200 shadow-xs dark:border-gray-600 rounded-full grow bg-gray-100 dark:bg-gray-700 basis-2xs shrink-0'>
          <label htmlFor="search" className='flex gap-2 items-center py-1 pl-4'>
            <Search className='size-5 text-gray-600 dark:text-gray-400' />
            <Input
              id='search'
              type='search'
              value={search}
              className='border-none px-0 pr-4 focus:outline-none! focus:border-none! ring-0! shadow-none'
              placeholder='Busca un usuario en la plataforma por correo o nombre'
              onChange={handleSearchText}
            />
          </label>
        </search>
        <div className="roles flex flex-row px-4 py-2 gap-3 items-center text-sm bg-gray-100 md:px-4 rounded-full font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
          <span className='bg-white dark:bg-gray-200 px-2 py-1 rounded-md shadow-md text-black'>Todos</span>
          <span>Profesor</span>
          <span>Estudiante</span>
          <span>Tutor</span>
        </div>
        <div className='text-gray-200 flex gap-2 items-center'>
          {/* <ListFilter /> */}
          <span className='text-gray-500 dark:text-gray-400'>Resultados:</span>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="bg-gray-100 text-gray-800 dark:bg-gray-600 border-none outline-none cursor-pointer p-2 rounded-md dark:text-gray-200"
          >
            <option value="4">4</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>

        </div>
      </section>

      {/* Tabla */}
      <section className="table w-full">
        <DataTable columns={columns} data={users.data} />
        <Pagination links={users.links} />
      </section>

    </ContentLayout>
  );
}