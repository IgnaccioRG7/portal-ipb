// resources/js/components/student-autocomplete.tsx
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Student {
  id: number;
  nombre_completo: string;
  ci: string;
  email: string;
}

interface StudentAutocompleteProps {
  onSelect: (studentId: number, studentName: string) => void;
  error?: string;
  initialValue?: string;
  required?: boolean;
}

export default function StudentAutocomplete({
  onSelect,
  error,
  initialValue = '',
  required = false
}: StudentAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar estudiantes con debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 1 && !selectedStudent) {
        fetchStudents(searchTerm);
      } else {
        setStudents([]);
        setIsOpen(false);
      }
    }, 300); // Espera 300ms después de que el usuario deje de escribir

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedStudent]);

  const fetchStudents = async (search: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/students/search?q=${encodeURIComponent(search)}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setIsOpen(data.length > 0);
      }
    } catch (error) {
      console.error('Error buscando estudiantes:', error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm(student.nombre_completo);
    onSelect(student.id, student.nombre_completo);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // Si el usuario borra, limpiar selección
    if (!newValue) {
      setSelectedStudent(null);
      onSelect(0, '');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedStudent(null);
    onSelect(0, '');
    setStudents([]);
  };

  return (
    <div className="flex flex-col gap-2 relative w-full h-full pt-1" ref={wrapperRef}>
      <Label htmlFor="estudiante_autocomplete" className=''>
        Estudiante {required && '*'}
      </Label>

      <div className="relative w-full h-full">
        <Input
          id="estudiante_autocomplete"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Buscar por nombre, apellido o CI..."
          required={required}
          className={`h-full ${selectedStudent ? 'pr-20' : ''}`}
          autoComplete="off"
        />

        {selectedStudent && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm px-2"
          >
            ✕ Limpiar
          </button>
        )}

        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && students.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto top-full">
          {students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => handleSelect(student)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="font-medium text-sm">{student.nombre_completo}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                CI: {student.ci} • {student.email}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && !isLoading && searchTerm.length >= 2 && students.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 text-center text-sm text-gray-500 top-full">
          No se encontraron estudiantes
        </div>
      )}

      <InputError message={error} />

      {selectedStudent && (
        <div className="text-xs text-green-600 dark:text-green-400">
          Estudiante seleccionado: {selectedStudent.nombre_completo}
        </div>
      )}
    </div>
  );
}