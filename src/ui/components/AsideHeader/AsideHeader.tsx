import { useEffect, useState } from 'react';
import { AsideHeader as Header } from '@gravity-ui/navigation';

import { Router } from '@/ui/router/Router';

import { ICON } from './constants/menuItems.tsx';
import { MENU_ITEMS } from './constants/menuItems.tsx';
import useAuth from '@/ui/auth/useAuth.ts';


export const AsideHeader = () => {
    const initialCompact = localStorage.getItem('asideHeaderCompact') == 'true';
    const [compact, setCompact] = useState(initialCompact);

    const { user } = useAuth();

    console.log(user);

    useEffect(() => {
        localStorage.setItem('asideHeaderCompact', String(compact))
    }, [compact])

    return(
        <Header 
            compact={compact}
            onChangeCompact={setCompact} 
            logo={ICON}
            menuItems={MENU_ITEMS.filter((item) => (!item.adminOnly || user?.isAdmin) && (!item.userOnly || !user?.isAdmin))}
            renderContent={Router}
        />
    );
};
