import { Person, ArrowRightToSquare, LayoutHeaderCells } from '@gravity-ui/icons';

import { routeMap } from '@/ui/router/routeMap';

export const ICON = {
    icon: LayoutHeaderCells,
    text: 'Dashboard',
    iconSize: 24,
    textSize: 15,
    href: routeMap.dashboard,
};

export const MENU_ITEMS = [{
        id: '0',
        icon: Person,
        title: 'Клиенты',
        link: routeMap.clients,
        adminOnly: true,
    },
    {
        id: '1',
        icon: LayoutHeaderCells,
        title: 'Дашборд',
        link: routeMap.dashboard,
        userOnly: true,
    },
    {
        id: '2',
        icon: ArrowRightToSquare,
        title: 'Выйти',
        link: routeMap.dashboard,
        onItemClick: () => {
            window.localStorage.removeItem('token');
            window.location.reload();
        }
    }
];
