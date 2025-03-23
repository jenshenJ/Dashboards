export type Review = {
    id: string,
    title: string,
    type: 'Позитивный' | 'Нейтральный'| 'Негативный',
    review: string,
    userRating: number,
    author: string,
};
