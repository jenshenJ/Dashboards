import { FilmList } from '@/ui/components/FilmList/FilmList';
import { DefaultPage } from '@/ui/pages/DefaultPage/DefaultPage';

export const FilmsPage = () => {
    return (
        <DefaultPage title={'Все фильмы планеты'}>
            <FilmList/>
        </DefaultPage>
    );
};
