export const getEstimationColor = (estimation: string) => {
    const num = Number(estimation);

    if (num >= 7) {
        return 'positive';
    }

    if (num <= 4) {
        return 'danger';
    }

    return 'primary';
}
