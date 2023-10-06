export const unique = <T>(arr: T[]): T[] => {
    const set = new Set(arr);
    return Array.from(set);
};
