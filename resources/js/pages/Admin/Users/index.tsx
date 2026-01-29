
import { DataTable } from '@/components/data-table';
import { Head } from '@inertiajs/react';


interface User {
  id: number;
  nombre_completo: string;
  email: string;
  rol: string;
  estado: string;
  ultimo_acceso: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  activos: number;
  pendientes: number;
  bloqueados: number;
}

export default function Index({ users, stats }: { users: User[], stats: Stats }) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre_completo', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    {
      key: 'estado',
      label: 'Estado',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded text-xs ${user.estado === 'activo' ? 'bg-green-100 text-green-800' :
            user.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
              user.estado === 'bloqueado' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
          }`}>
          {user.estado}
        </span>
      )
    },
    { key: 'created_at', label: 'Registro' },
  ];

  return (
    <>
      {/* <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800">Usuarios</h2>}
        > */}
      <Head title="Usuarios" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">Activos</div>
              <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">Pendientes</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">Bloqueados</div>
              <div className="text-2xl font-bold text-red-600">{stats.bloqueados}</div>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow p-6">
            <DataTable columns={columns} data={users} />
          </div>
        </div>
      </div>
      {/* </AuthenticatedLayout> */}
    </>
  );
}