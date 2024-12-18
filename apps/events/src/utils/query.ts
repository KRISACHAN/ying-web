export const getQuery = (key: string): string | null => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
};
