import { Toaster } from '@/components/ui/toaster';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import { Head } from '@inertiajs/react';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

            <link
                href="https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;600;700&family=Raleway:wght@400;500;600&display=swap"
                rel="stylesheet"
            />
        </Head>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster />
            {children}
        </AppLayoutTemplate>
    </>
);
