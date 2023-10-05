export const seconds = (n: number) => n * 1000;
export const minutes = (n: number) => seconds(n) * 60;
export const hours = (n: number) => minutes(n) * 60;
export const days = (n: number) => hours(n) * 24;
export const weeks = (n: number) => days(n) * 7;
export const months = (n: number) => days(n) * 30;
export const years = (n: number) => days(n) * 365;
