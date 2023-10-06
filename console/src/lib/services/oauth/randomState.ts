export const randomState = (length = 40) => {
	const crypto = window.crypto;
	const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	const values = new Array(length);
	array.forEach((v, i) => {
		values[i] = validChars.charCodeAt(v % validChars.length);
	});
	return String.fromCharCode.apply(null, values);
};
