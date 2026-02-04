import { dashboard, login } from "@/routes";
import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";

export default function Header({ isLanding }: { isLanding?: boolean }) {

  const { auth } = usePage<SharedData>().props;

  return (
    <header className="mb-6 w-full text-sm not-has-[nav]:hidden lg:max-w-7xl mx-auto flex justify-between gap-2 px-6 py-2 lg:px-2 absolute z-50 left-0 right-0">
      <Link
        href={'/'}
      >
        <img src='/logo.png' alt='logo IPB' className='w-12' />
      </Link>
      <nav className="flex items-center justify-end">
        <Link
          className={`inline-block rounded-sm px-4 py-1.5 text-sm leading-normal hover:border-white dark:border-[#3E3E3A] ${isLanding ? 'text-white dark:text-[#EDEDEC]' : 'dark:text-white'} dark:hover:border-[#62605b]`}
          href={'/recursos'}
        >
          Recursos
        </Link>
        {auth.user ? (
          <Link
            href={dashboard()}
            className={`inline-block rounded-sm px-4 py-1.5 text-sm leading-normal hover:border-white dark:border-[#3E3E3A] ${isLanding ? 'text-white dark:text-[#EDEDEC]' : 'dark:text-white'} dark:hover:border-[#62605b]`}
          >
            Ir al inicio
          </Link>
        ) : (
          <>
            <Link
              href={login()}
              className={`inline-block rounded-sm px-4 py-1.5 text-sm leading-normal hover:border-white dark:border-[#3E3E3A] ${isLanding ? 'text-white dark:text-[#EDEDEC]' : 'dark:text-white'} dark:hover:border-[#62605b]`}
            >
              Inicia sesion
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}