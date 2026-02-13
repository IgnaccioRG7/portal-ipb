import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      {links.map((link, index) => {
        // Primer botón (Previous)
        if (index === 0) {
          return (
            <Link
              key={index}
              href={link.url || '#'}
              preserveScroll
              className={`px-3 py-2 rounded-md ${
                !link.url
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          );
        }

        // Último botón (Next)
        if (index === links.length - 1) {
          return (
            <Link
              key={index}
              href={link.url || '#'}
              preserveScroll
              className={`px-3 py-2 rounded-md ${
                !link.url
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          );
        }

        // Botones de números de página
        return (
          <Link
            key={index}
            href={link.url || '#'}
            preserveScroll
            className={`px-4 py-2 rounded-md ${
              link.active
                ? 'bg-blue-600 text-white dark:bg-blue-900'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-300'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}