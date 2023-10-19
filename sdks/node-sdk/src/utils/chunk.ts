export const chunk = (text: string, size: number) => {
    const length = text == null ? 0 : text.length;
    if (!length || size < 1) {
        return [];
    }
    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(length / size));

    while (index < length) {
        result[resIndex++] = text.slice(index, (index += size));
    }
    return result;
};
