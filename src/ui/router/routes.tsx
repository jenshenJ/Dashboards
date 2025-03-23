import { GuestGuard } from "../auth/GuestGuard";
import { FilmsPage } from "../pages/FilmsPage/FilmsPage";
import { MoviePage } from '../pages/MoviePage/MoviePage';
import { DashboardPage } from '../pages/DashboardPage/DashboardPage';
import { routeMap } from "./routeMap";
import { ClientsPage } from "../pages/ClientsPage/СlientsPage";

export const routes = [
    {
        path: routeMap.movie,
        element: <GuestGuard><MoviePage /></GuestGuard>,
    },
    {
        path: routeMap.dashboard,
        element: <GuestGuard><DashboardPage/></GuestGuard>
    },
    {
        path: routeMap.clients,
        element: <GuestGuard adminOnly ><ClientsPage/></GuestGuard>
    }
];
