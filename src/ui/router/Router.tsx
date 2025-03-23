import { routes } from './routes';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

export const router = createBrowserRouter(routes);

export const Router = () => {
    return (
        <RouterProvider router={router} />
    );
}