
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ContentLayout from '@/layouts/content-layout';
import StudentAutocomplete from '@/components/ui/auto-complete';
import { useMemo } from 'react';


interface Rol {
  id: number;
  nombre: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: admin.users.index().url
  },
  {
    title: 'Crear usuario',
    href: admin.users.create().url,
  },
];

export default function Create({ roles }: { roles: Rol[] }) {
  const { data, setData, post, processing, errors, get } = useForm({
    // Datos de Persona
    ci: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    genero: 'masculino',
    celular: '',
    direccion: '',
    ciudad: 'La Paz',
    estudiante_id: 0,
    parentesco: '',

    // Datos de Usuario
    email: '',
    password: '',
    password_confirmation: '',
    rol_id: '',
  });

  const isTutor = useMemo(() => {
    const selectedRole = roles.find(r => r.id.toString() === data.rol_id.toString());
    return selectedRole?.nombre === 'Tutor';
  }, [data.rol_id, roles]);

  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!isTutor) {
      data.estudiante_id = 0
      data.parentesco = ''
    }

    post(admin.users.store().url, {
      onSuccess: () => {
        // Opcional: mensaje de éxito
      }
    });
  };

  // const isSelecteRol = get('rol_id')

  return (
    <ContentLayout
      breadcrumbs={breadcrumbs}
      title="Crear Usuario"
      subtitle='Registra un nuevo usuario en la plataforma'
    >

      <section className="form pt-0 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={submit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <div className="row-span-2">
              <h3 className="text-lg font-semibold border-b pb-2">1. Datos Personales</h3>

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

            <div className='grid gap-y-4'>
              {/* SECCIÓN 2: DATOS DE CUENTA */}
              <div className="">
                <h3 className="text-lg font-semibold border-b pb-2">2. Datos de Cuenta</h3>

                <div className="grid gap-4">
                  <div className="grid gap-2  mt-2">
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
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password_confirmation">Repetir Contraseña *</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        required
                      />
                    </div>
                    <InputError message={errors.password} />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: ROL */}
              <div className="">
                <h3 className="text-lg font-semibold border-b pb-2">3. Rol del Usuario</h3>

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

                {/* OPCIONAL SELECCION DEL HIJO */}
                {
                  data.rol_id === '4' && (
                    <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 grid gap-2 mt-4 grid-cols-1 xl:grid-cols-2 md:gap-4">
                      <div>
                        <StudentAutocomplete
                          onSelect={(studentId, studentName) => {
                            setData('estudiante_id', studentId);  // Cambiar a estudiante_id
                          }}
                          error={errors.estudiante_id}  // Cambiar el nombre del error
                          initialValue=""  // Remover la referencia a user.tutor
                          required={true}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rol_id">Parentesco *</Label>
                        <select
                          id="parentesco"
                          value={data.parentesco}
                          onChange={e => setData('parentesco', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          required
                        >
                          <option value="" disabled>Seleccione un parentesco</option>
                          <option value="padre">Padre</option>
                          <option value="madre">Madre</option>
                          <option value="tio">Tio</option>
                          <option value="tia">Tia</option>
                          <option value="abuelo">Abuelo</option>
                          <option value="abuela">Abuela</option>
                          <option value="otro">Otro</option>
                        </select>
                        <InputError message={errors.ci} />
                      </div>
                    </div>
                  )
                }

              </div>

            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-4 md:col-span-2 justify-self-end">
              <Link
                href={admin.users.index().url}
                className="text-sm text-gray-600 hover:text-gray-900 underline dark:text-gray-200"
              >
                Cancelar
              </Link>
              <Button type="submit" disabled={processing} className='cursor-pointer bg-green-600 text-white hover:bg-green-500 transition-colors duration-300'>
                {processing ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </div>
      </section>

    </ContentLayout>
  );
}