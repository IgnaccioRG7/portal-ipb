import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users } from 'lucide-react';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import admin from '@/routes/admin';
import type { SharedData } from '@/types';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Inicio',
//         href: dashboard(),
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Users',
//         // href: '/admin/users',
//         href: admin.users.index(),
//         icon: LayoutGrid,
//     },
// ];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;
    const rol = auth?.user?.rol?.rol_name || '';

    const getNavItems = (): NavItem[] => {
        const items: NavItem[] = [];
        // const items: NavItem[] = [
        //     {
        //         title: 'Inicio',
        //         href: dashboard(),
        //         icon: LayoutGrid,
        //     },
        // ];

        if (rol === 'Admin') {
            items.push({
                title: 'Inicio',
                href: admin.dashboard(),
                icon: LayoutGrid,
            });
            items.push({
                title: 'Usuarios',
                href: admin.users.index(),
                icon: Users,
            });
        }

        if (rol === 'Profesor') {
            items.push({
                title: 'Inicio',
                href: '/profesor',
                icon: LayoutGrid,
            });
            // items.push({
            //     title: 'Mis Clases',
            //     href: '/profesor/clases',
            //     icon: BookMarked,
            // });
        }

        if (rol === 'Estudiante') {
            items.push({
                title: 'Inicio',
                href: '/estudiante',
                icon: LayoutGrid,
            });
            // items.push({
            //     title: 'Mis Cursos',
            //     href: '/estudiante/cursos',
            //     icon: GraduationCap,
            // });
        }

        return items;
    };
    

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* <NavMain items={mainNavItems} /> */}
                <NavMain items={getNavItems()} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
