// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContentLayout from '@/layouts/content-layout';
import { Head, useForm } from '@inertiajs/react';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recursos',
        href: admin.recursos.index().url
    },
    {
        title: 'Crear recurso',
        href: admin.recursos.create().url,
    },
];

export default function RecursoCreate({ }) {

    const { data, setData, post, processing, errors } = useForm<{
        titulo: string;
        descripcion: string;
        archivo: File | null; // Asegúrate que sea File | null
        visible: boolean;
        categoria: string;
    }>({
        titulo: '',
        descripcion: '',
        archivo: null,
        visible: true,
        categoria: 'otro'
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        // post(route('admin.recursos.store'));
        post(admin.recursos.store().url);
    };

    return (
        <ContentLayout
            breadcrumbs={breadcrumbs}
            title='Nuevo Recurso'
            subtitle='Crea un recurso para que se vea en la pagina de inicio'
        >
            <Head title="Nuevo Recurso" />

            <section className="py-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Título */}
                    <div>
                        <Label htmlFor='titulo'>
                            Título *
                        </Label>
                        <Input
                            id='titulo'
                            type='text'
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                        />
                        {errors.titulo && (
                            <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <Label htmlFor='descripcion'>
                            Descripción
                        </Label>
                        <Textarea
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            rows={4}
                        />
                        {errors.descripcion && (
                            <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="categoria">Categoria *</Label>
                        <select
                            id="categoria"
                            value={data.categoria}
                            onChange={e => setData('categoria', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            required
                        >
                            <option value="otro">Otro</option>
                            <option value="policias">Policias</option>
                            <option value="militares">Militares</option>
                            <option value="medicina">Medicina</option>
                            <option value="ingenieria">Ingenieria</option>
                        </select>
                        <InputError message={errors.categoria} />
                    </div>

                    {/* Archivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Archivo PDF *
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            // onChange={(e) => {
                            //     const files = e.target.files;
                            //     // Verificación de null
                            //     if (files && files.length > 0) {
                            //         setData('archivo', files[0]);
                            //     } else {
                            //         setData('archivo', null);
                            //     }
                            // }}
                            onChange={(e) => setData('archivo', e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                        />
                        {errors.archivo && (
                            <p className="mt-1 text-sm text-red-600">{errors.archivo}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Máximo 10MB. Solo archivos PDF.
                        </p>
                    </div>

                    {/* Visible */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.visible}
                            onChange={(e) => setData('visible', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Visible públicamente
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3">
                        <a
                            // href={route('admin.recursos.index')}
                            href={admin.recursos.index().url}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Guardar Recurso'}
                        </button>
                    </div>
                </form>
            </section>
        </ContentLayout>
    );
}