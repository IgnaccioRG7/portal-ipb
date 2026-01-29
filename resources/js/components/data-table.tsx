import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className="w-full">
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de lista para mobile */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div key={rowIndex} className="bg-white rounded-lg shadow overflow-hidden">
              {columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className={`px-4 py-3 ${colIndex !== columns.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {column.label}
                    </span>
                    <span className="text-sm text-gray-900">
                      {column.render ? column.render(row) : row[column.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}