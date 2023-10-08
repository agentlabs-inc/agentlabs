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
	const hashParams: { [key: string]: string } = {};
	let e: RegExpExecArray | null;
	const r = /([^&;=]+)=?([^&;]*)/g;
	const q = window.location.hash.substring(1);
	while ((e = r.exec(q))) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

export const getRedirectResult = async (): Promise<{
	code: string;
	state: string;
}> => {
	const currentUrl = window.location.href;
	let urlParams = parseUrlParams(currentUrl);

	if (!Object.values(urlParams).length) {
		urlParams = parseUrlHashParams();
	}

	if (!urlParams.code) {
		throw new Error("Missing code url param");
	}

	return {
		code: urlParams.code,
		state: urlParams.state
	};
};
