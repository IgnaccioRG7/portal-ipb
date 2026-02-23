import * as Toast from '@radix-ui/react-toast';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Check, X } from 'lucide-react';

export function Toaster() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  // Leemos errors (de withErrors) y flash.success (de with)
  const { errors, flash } = usePage().props as any;

  useEffect(() => {
    // 1. Prioridad: errores de validación (withErrors)
    if (errors && Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setMessage(firstError as string);
      setType('error');
      setOpen(true);
    }
    // 2. Si no hay errores, mostrar mensaje de éxito (with)
    else if (flash?.success) {
      setMessage(flash.success);
      setType('success');
      setOpen(true);
    }
    // 3. (Opcional) Si también quieres errores vía flash
    else if (flash?.error) {
      setMessage(flash.error);
      setType('error');
      setOpen(true);
    }
  }, [errors, flash]); // Se ejecuta cuando cambian errors o flash

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={`fixed bottom-4 right-4 z-100! rounded-lg p-4 shadow-lg text-white ${type === 'success' ? 'bg-green-700' : 'bg-red-700'
          }`}
        open={open}
        onOpenChange={setOpen}
        duration={3000} // 3 segundos
      >
        <Toast.Title className="font-medium text-sm">
          {
          type === 'success' 
            ? <div className='flex flex-row gap-2 items-center'><Check size={16} /><span>Exito</span></div> 
            : <div className='flex flex-row gap-2 items-center'><X size={16} /><span>Algo fallo</span></div>
          }
        </Toast.Title>
        <Toast.Description>
          <span className='text-sm'>{message}</span>
        </Toast.Description>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
    </Toast.Provider>
  );
}