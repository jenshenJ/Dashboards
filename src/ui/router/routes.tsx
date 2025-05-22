import { GuestGuard } from "../auth/GuestGuard";
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { routeMap } from "./routeMap";
import { ClientsPage } from "../pages/ClientsPage/СlientsPage";

export const routes = [
    {
        path: routeMap.dashboard,
        element: <GuestGuard><DashboardPage/></GuestGuard>
    },
    {
        path: routeMap.clients,
        element: <GuestGuard adminOnly ><ClientsPage/></GuestGuard>
    },
    {
        path: '/',
        element: <GuestGuard><DashboardPage/></GuestGuard>
    }
];
