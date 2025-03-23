export const getMovieDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = '';
    if (hours > 0) {
        result += `${hours}ч `;
    }
    if (remainingMinutes > 0 || hours === 0) {
        result += `${remainingMinutes}мин`;
    }

    return result.trim();
}