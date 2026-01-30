// resources/js/Pages/Admin/Users/edit.tsx
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ContentLayout from '@/layouts/content-layout';

interface Rol {
  id: number;
  nombre: string;
}

interface User {
  id: number;
  email: string;
  rol_id: string;
  estado: string;
  persona: {
    ci: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: string;
    genero: string;
    celular: string;
    direccion: string;
    ciudad: string;
  }
}

// Define los breadcrumbs sin usar :id en la URL
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: admin.users.index().url,
  },
  {
    title: 'Editar usuario',
    href: '#', // Usamos # porque la URL real depende del ID del usuario
  },
];

export default function Edit({ user, roles }: { user: User, roles: Rol[] }) {
  const { data, setData, put, processing, errors } = useForm({
    // Datos de Persona
    ci: user.persona.ci,
    nombre: user.persona.nombre,
    apellido_paterno: user.persona.apellido_paterno,
    apellido_materno: user.persona.apellido_materno,
    fecha_nacimiento: user.persona.fecha_nacimiento,
    genero: user.persona.genero,
    celular: user.persona.celular,
    direccion: user.persona.direccion,
    ciudad: user.persona.ciudad,

    // Datos de Usuario
    email: user.email,
    password: '',
    password_confirmation: '',
    rol_id: user.rol_id,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Wayfinder: Pasar la URL como string directamente
    put(admin.users.update(user.id).url, {
      onSuccess: () => {
        // Opcional: mensaje de éxito
      }
    });
  };

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title='Editar Usuario'
      subtitle='Modifica los campos de un usuario existente'
    >
      <Head title="Editar Usuario" />

      <section className="form pt-0 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={submit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <div className="row-span-2">
              <h3 className="text-lg font-semibold border-b">1. Datos Personales</h3>

              <div className="grid gap-4 mt-2">
                <div className="grid gap-2">
                  <Label htmlFor="ci">CI *</Label>
                  <Input
                    id="ci"
                    value={data.ci}
                    onChange={e => setData('ci', e.target.value)}
                    required
                    placeholder="Ej: 1234567"
                  />
                  <InputError message={errors.ci} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={data.nombre}
                      onChange={e => setData('nombre', e.target.value)}
                      required
                    />
                    <InputError message={errors.nombre} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="apellido_paterno">Paterno *</Label>
                    <Input
                      id="apellido_paterno"
                      value={data.apellido_paterno}
                      onChange={e => setData('apellido_paterno', e.target.value)}
                      required
                    />
                    <InputError message={errors.apellido_paterno} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="apellido_materno">Materno</Label>
                    <Input
                      id="apellido_materno"
                      value={data.apellido_materno}
                      onChange={e => setData('apellido_materno', e.target.value)}
                    />
                    <InputError message={errors.apellido_materno} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      value={data.fecha_nacimiento}
                      onChange={e => setData('fecha_nacimiento', e.target.value)}
                    />
                    <InputError message={errors.fecha_nacimiento} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="genero">Género *</Label>
                    <select
                      id="genero"
                      value={data.genero}
                      onChange={e => setData('genero', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                    <InputError message={errors.genero} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      type="tel"
                      value={data.celular}
                      onChange={e => setData('celular', e.target.value)}
                      placeholder="Ej: 70123456"
                    />
                    <InputError message={errors.celular} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Input
                      id="ciudad"
                      value={data.ciudad}
                      onChange={e => setData('ciudad', e.target.value)}
                      required
                    />
                    <InputError message={errors.ciudad} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={data.direccion}
                    onChange={e => setData('direccion', e.target.value)}
                    placeholder="Dirección completa"
                  />
                  <InputError message={errors.direccion} />
                </div>
              </div>
            </div>

            <div className='grid gap-y-2'>
              {/* SECCIÓN 2: DATOS DE CUENTA */}
              <div className="">
                <h3 className="text-lg font-semibold border-b">2. Datos de Cuenta</h3>

                <div className="grid gap-4 mt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                    <InputError message={errors.email} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Nueva Contraseña (dejar en blanco para mantener la actual)</Label>
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                      />                      
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                      />
                    </div>
                    <InputError message={errors.password} />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: ROL */}
              <div className="">
                <h3 className="text-lg font-semibold border-b">3. Rol del Usuario</h3>

                <div className="grid gap-2 mt-2">
                  <Label htmlFor="rol_id">Rol *</Label>
                  <select
                    id="rol_id"
                    value={data.rol_id}
                    onChange={e => setData('rol_id', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.rol_id} />
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-4 md:col-span-2 justify-self-end">
              <Link
                href={admin.users.index()}
                className="text-sm text-gray-600 hover:text-gray-900 underline dark:text-gray-200"
              >
                Cancelar
              </Link>
              <Button type="submit" disabled={processing} className='cursor-pointer bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-300'>
                {processing ? 'Actualizando...' : 'Actualizar Usuario'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </ContentLayout>
  );
}