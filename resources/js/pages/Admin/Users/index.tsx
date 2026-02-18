import { DataTable } from '@/components/data-table';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Pagination from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { DialogContent, DialogDescription, DialogTrigger } from '@radix-ui/react-dialog';
import { UserPlus, Edit, ShieldOff, Users, UserRoundCheck, UserRoundX, Search, ListFilter, XIcon } from 'lucide-react';
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
  per_page: number,
  role: string
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: dashboard().url,
  },
];

const DEFAULT_VALUE_FILTERS = {
  search: '',
  per_page: 4,
  role: ''
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

  // const [openDialog, setOpenDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null as number | null
  });

  const [search, setSearch] = useState(() => {
    return filters?.search
  })
  const debounceRef = useRef<any>(null)
  const [perPage, setPerPage] = useState<number>(() => {
    return filters.per_page
  })
  const [selectedRole, setSelectedRole] = useState(() => {
    return filters.role ?? ''
  })

  // console.log(users);

  // Filtrando datos por pagina
  const handlePerPageChange = (results: number) => {
    setPerPage(results);

    const params: any = {};

    // Mantener búsqueda si existe
    if (search) params.search = search;

    // Agregar rol solo si no es vacío (no es "Todos")
    if (selectedRole !== '') {
      params.role = selectedRole;
    }

    if (results === DEFAULT_VALUE_FILTERS.per_page) {
      router.get(admin.users.index(), params, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    } else {
      router.get(admin.users.index(), {
        ...params,
        per_page: results
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }
  }

  // Filtrando dator por el tipo de rol
  const handleRolFilter = (rol: string) => {
    setSelectedRole(rol);

    const params: any = {};

    // Mantener búsqueda si existe
    if (search) params.search = search;

    // Mantener per_page si no es el default
    if (perPage !== DEFAULT_VALUE_FILTERS.per_page) {
      params.per_page = perPage;
    }

    // Agregar rol solo si no es vacío (no es "Todos")
    if (rol !== '') {
      params.rol = rol;
    }

    router.get(admin.users.index().url, params, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  // Filtrando datos por el buscador
  // 1. Función de debounce independiente (NO dentro de useEffect)
  const debounceSearch = (value: string) => {
    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    let params: any = {}

    // Mantener per_page si no es el default
    if (perPage !== DEFAULT_VALUE_FILTERS.per_page) {
      params.per_page = perPage;
    }

    // Agregar rol solo si no es vacío (no es "Todos")
    if (selectedRole !== '') {
      params.role = selectedRole;
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim() === '') {
        // Si está vacío, quitar el parámetro search de la URL
        router.get(admin.users.index(), params, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        });
      } else {
        // Si tiene valor, buscar con el parámetro
        router.get(admin.users.index(), { ...params, search: value }, {
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

  const handleEdit = (userId: number) => {
    // Redirigir a la página de edición
    router.visit(admin.users.edit(userId));
  };

  // const handleDelete = (userId: number) => {
  //   if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
  //     router.delete(admin.users.destroy(userId), {
  //       preserveScroll: true,
  //       onSuccess: () => {
  //         // Aquí podrías agregar un toast de éxito si lo deseas
  //         console.log('Usuario eliminado');
  //       }
  //     });
  //   }
  // };
  const handleDelete = (userId: number) => {
    setDeleteDialog({
      open: true,
      userId
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.userId) {
      router.delete(admin.users.destroy(deleteDialog.userId), {
        preserveScroll: true,
        onSuccess: () => {
          console.log('Usuario eliminado');
        }
      });
    }
  };

  const handleToggleStatusUser = (userId: number) => {
    router.patch(admin.users.toggleEstado(userId), {}, {
      onSuccess: () => {
        console.log('Cambio de estado exitosamente');
      },
      onError: () => {
        console.log('Ocurrio un error al cambiar el estado');
      },
    });
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre_completo', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    {
      key: 'estado',
      label: 'Estado',
      render: (user: User) => (
        <div className='flex items-center gap-1'>
          {/* <span className={`w-2 h-2 block rounded-full text-xs ${user.estado === 'activo' ? 'bg-green-500' :
            user.estado === 'inactivo' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
          </span> */}
          <Switch
            checked={user.estado === 'activo'}
            onCheckedChange={() => handleToggleStatusUser(user.id)}
            aria-label='Cambiar estado del usuario'
          />
          <Label className="text-xs">
            {user.estado === 'activo' ? (
              <span className="text-green-600 font-semibold">Activo</span>
            ) : (
              <span className="text-red-600 font-semibold">Inactivo</span>
            )}
          </Label>
        </div>
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

          {/* 🆕 BOTÓN PARA MATRICULAR (solo estudiantes) */}
          {user.rol === 'Estudiante' && (
            <Link
              // href={route('admin.matriculas.estudiante', user.id)}
              href={admin.matriculas.estudiante({
                user: user.id
              }).url}
              className="flex items-center gap-1 p-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
              title="Matricular estudiante"
            >
              <UserRoundCheck className="w-4 h-4" />
            </Link>
          )}
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
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={confirmDelete}
        title="Eliminar usuario"
        description="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
      {/* <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className='cursor-pointer'>Open dialog</Button>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
          <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-md bg-white rounded-lg shadow-xl p-6 border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold mb-2">
                Título del Diálogo
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mb-4">
                Descripción del diálogo
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              Contenido del diálogo...
            </div>

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Acción de confirmación
                  setOpenDialog(false);
                }}
                className="cursor-pointer"
              >
                Confirmar
              </Button>
            </DialogFooter>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog> */}


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
          <span
            onClick={() => handleRolFilter('')}
            className={`px-2 py-1 rounded-md cursor-pointer transition-all ${selectedRole === ''
              ? 'bg-white dark:bg-gray-200 shadow-md text-black'
              : 'hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
          >
            Todos
          </span>
          <span
            onClick={() => handleRolFilter('Profesor')}
            className={`px-2 py-1 rounded-md cursor-pointer transition-all ${selectedRole === 'Profesor'
              ? 'bg-white dark:bg-gray-200 shadow-md text-black'
              : 'hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
          >
            Profesor
          </span>
          <span
            onClick={() => handleRolFilter('Estudiante')}
            className={`px-2 py-1 rounded-md cursor-pointer transition-all ${selectedRole === 'Estudiante'
              ? 'bg-white dark:bg-gray-200 shadow-md text-black'
              : 'hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
          >
            Estudiante
          </span>
          <span
            onClick={() => handleRolFilter('Tutor')}
            className={`px-2 py-1 rounded-md cursor-pointer transition-all ${selectedRole === 'Tutor'
              ? 'bg-white dark:bg-gray-200 shadow-md text-black'
              : 'hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
          >
            Tutor
          </span>
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