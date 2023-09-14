export const navigateToUrl = async (url: string) => {
    if (!url) {
        throw new Error('Missing url argument');
    }
    window.location.replace(url);

    return Promise.resolve();
};

export const getUrl = () => {
    return window.location.href;
};

export const parseUrlParams = (url: string) => {
    const urlObj = new URL(url);

    const searchParams = urlObj.searchParams;

    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};

export function parseUrlHashParams(): { [key: string]: string } {
    let hashParams: { [key: string]: string } = {};
    let e: RegExpExecArray | null;
    let r = /([^&;=]+)=?([^&;]*)/g;
    let q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}
