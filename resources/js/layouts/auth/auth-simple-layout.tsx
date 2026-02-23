import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { dashboard } from '@/routes';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center bg-[#FDFDFC] px-6 lg:px-2 py-4 text-[#1b1b18] dark:text-white lg:justify-center dark:bg-gray-900">
            <header className="mb-6 w-full text-sm not-has-[nav]:hidden lg:max-w-7xl mx-auto flex justify-between gap-2 absolute top-0 py-2">
                <Link
                    href={'/'}
                >
                    <img src='/logo.png' alt='logo IPB' className='w-12' />
                </Link>
                <nav className="flex items-center justify-end gap-4">
                    <Link
                        href={'/'}
                        className="inline-block font-bold rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Volver atras
                    </Link>
                </nav>
            </header>

            <div className='grow w-full h-full flex items-center justify-center'>
                <div className="flex h-auto gap-6 shadow-xl dark:bg-[#000d2e]/90 w-full md:max-w-2xl lg:max-w-4xl rounded-lg overflow-hidden">
                    <div className="logo bg-[#000d2e]/80 dark:bg-white w-full hidden md:flex items-center justify-center">
                        <img src="/logo.png" alt="Logo ipb" className='w-full max-w-48 h-auto' />
                    </div>
                    <div className="w-full p-6 md:p-10">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                {/* <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="mb-1 flex size-16 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link> */}

                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium">{title}</h1>
                                    <p className="text-center text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
