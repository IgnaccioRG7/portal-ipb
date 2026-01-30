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
import { useState } from 'react';

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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: dashboard().url,
  },
];

export default function Index({ users, stats }: { users: PaginatedUsers, stats: Stats }) {
  const [search, setSearch] = useState('')

  console.log(users);

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    console.log(value);
    
  }

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
              className='border-none px-0 pr-4 focus:outline-none! focus:border-none! ring-0!'
              placeholder='Busca un usuario en la plataforma'
              onChange={handleSearch}
            />
          </label>
        </search>
        <button className='hidden md:flex flex-row gap-2  items-center border border-gray-200 shadow-xs dark:border-gray-600 px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors duration-300 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-500'>
          <ListFilter />
          Mas filtros
        </button>
        <div className="roles flex flex-row px-4 py-2 gap-3 items-center text-sm bg-gray-100 md:px-4 rounded-full font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
          <span className='bg-white dark:bg-gray-200 px-2 py-1 rounded-md shadow-md text-black'>Todos</span>
          <span>Profesor</span>
          <span>Estudiante</span>
          <span>Tutor</span>
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