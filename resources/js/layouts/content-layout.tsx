import { Head } from "@inertiajs/react";
import AppLayout from "./app-layout";
import { BreadcrumbItem } from "@/types";


export default function ContentLayout({
  breadcrumbs,
  title,
  subtitle,
  actions,
  children
}: {
  breadcrumbs?: BreadcrumbItem[],
  title?: string,
  subtitle?: string,
  actions?: React.ReactNode,
  children?: React.ReactNode
}) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {
        title && (<Head title={title} />)
      }

      <main className='px-2 sm:px-6 lg:px-8 py-4 max-w-9xl'>
        <section className="heading w-full flex justify-between items-center flex-wrap gap-2 mb-4">
          {
            title && (
              <div className="title">
                <h1 className='text-2xl font-bold'>{title}</h1>
                <p className='text-gray-400'>{subtitle}</p>
              </div>
            )
          }
          {actions && (
            <div className="flex items-center gap-2 flex-wrap">
              {actions}
            </div>
          )}
        </section>
        {children}
      </main>
    </AppLayout >
  )
}