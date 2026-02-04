// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContentLayout from '@/layouts/content-layout';
import { Head, Link, router } from '@inertiajs/react';
import admin from '@/routes/admin';
import { DataTable } from '@/components/data-table';
import { Edit, Eye, Trash } from 'lucide-react';

export default function RecursosAdminIndex({ auth, recursos }) {
  console.log(recursos);

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este recurso?')) {
      // router.delete(route('admin.recursos.destroy', id));
      router.delete(admin.recursos.destroy(id));
    }
  };

  const handleToggleVisibility = (id) => {
    // router.patch(route('admin.recursos.toggle', id));
    router.patch(admin.recursos.toggle(id));
  };

  const columns = [
    { key: 'titulo', label: 'Titulo' },
    { key: 'nombre_original', label: 'Archivo' },
    {
      key: 'visible', label: 'Estado',
      render: (recurso: any) => (
        <span className={`w-fit px-2 py-1 block rounded-full text-xs text-white dark:text-gray-800 ${recurso.visible
          ? 'bg-green-500'
          : 'bg-red-100 text-red-800'
          }`}>
          {recurso.visible ? 'Visible' : 'Oculto'}
        </span>
      )
    },
    // { key: 'autor', label: 'Autor' },
    {
      key: 'categoria', label: 'Categoria',
      render: (recurso: any) => {
        return <span className='uppercase'>{recurso.categoria}</span>
      }
    },
    { key: 'fecha', label: 'Fecha' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (recurso: any) => {
        // console.log('=== DEBUG RECURSO ===');
        // console.log('Nombre archivo (recurso.archivo):', recurso.archivo);
        // console.log('URL completa (recurso.url):', recurso.url);
        // console.log('=====================');
        return (
          <div className="flex gap-2">
            <a
              href={recurso.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-900 mr-3"
              title='Ver PDF'
            >
              <Eye />
            </a>
            <Link
              // href={route('admin.recursos.edit', recurso.id)}
              href={admin.recursos.edit(recurso.id)}
              className="text-indigo-600 hover:text-indigo-900 mr-3"
              title='Editar'
            >
              <Edit />
            </Link>
            <button
              onClick={() => handleDelete(recurso.id)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title='Eliminar'
            >
              <Trash />
            </button>
          </div>
        )
      }
    },
    // { key: '', label: '' },
  ]

  return (
    <ContentLayout
      title='Gestión de Recursos'
      subtitle='Administra recursos que se visualizaran en la web'
      actions={
        <>
          <Link
            // href={route('admin.recursos.create')}
            href={admin.recursos.create().url}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
          >
            + Nuevo Recurso
          </Link>
        </>
      }
    >
      <Head title="Gestión de Recursos" />

      <DataTable columns={columns} data={recursos} />
    </ContentLayout>
  );
}