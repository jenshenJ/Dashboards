import { type FC, useCallback, useEffect, useState } from "react";

import block from 'bem-cn-lite';

import { Button, Loader, TextInput } from "@gravity-ui/uikit";

import { sdk } from '@/sdk';
import { CardMovie } from "@/sdk/types/cardMovie";

import { FilmCard } from "@/ui/components/FilmCard/FilmCard";

import './FilmList.scss';


const cn = block('film-list');

export const FilmList: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [movies, setMovies] = useState<CardMovie[]>([]);

    useEffect(() => {
        setIsLoading(true);
        sdk.getMovies().then((response) => {
            setMovies(response.data);
            setIsLoading(false);
        });
    }, []);


    const handleSearch = useCallback(async () => {
        setIsLoading(true);
        const response = await sdk.getMovies(searchValue);
        setIsLoading(false);

        setMovies(response.data);
    }, [searchValue]);

    return (
        <div className={cn()}>
            <div className={cn('input')}>
                <TextInput
                    placeholder='Найти фильм'
                    value={searchValue}
                    onUpdate={(newValue) => setSearchValue(newValue)}
                />
                <Button onClick={handleSearch} view={"action"}>{'Найти'}</Button>
            </div>
            {
                isLoading && <Loader size="l"/>
            }
            { !isLoading && movies.map((movie) => (
                    <FilmCard 
                        key={movie.id}
                        id={movie.id}
                        rang={movie.top250}
                        ruTitle={movie.name}
                        enTitle={movie.alternativeName}
                        releaseYear={movie.year}
                        imdbRating={movie.rating.imdb}
                        kpRating={movie.rating.kp}
                        imageURL={movie.poster.url}
                        countries={movie.countries.map(country => country.name)}
                        genres={movie.genres.map(genre => genre.name)}
                    />
                ))   
            }
        </div> 
    )
}