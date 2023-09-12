import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans]
			},
			colors: {
				"body-color-primary": "#FFFFFF",
				"body-color-subdued": "#C7C7C7",
				"tab-label-primary": "#FFFFFF",
				"background-primary": "#081018",
				"background-secondary": "#2C3442",
				"stroke-primary": "#202731",
				"bubble-bg-primary": "#2C3442",
				"bubble-bg-secondary": "#2D3F60",
				"bubble-body-primary": "#C7C7C7",
				"alert-bg-primary": "#494949",
				"alert-body-primary": "#FFFFFF",
				"card-bg-primary": "#1E2532",
				"card-body-primary": "#C7C7C7",
				"button-stroke-primary": "#016AD4",
				"button-bg-primary": "#016AD4",
				"button-label-primary": "#ECF4FE",
				"button-stroke-secondary": "#454C59",
				"button-bg-secondary": "#2C3442",
				"button-label-secondary": "#D2D2D2",
				"input-bg-primary": "#333333",
				"input-stroke-primary": "#858585",
				"input-label-primary": "#ECF4FE"
			}
		}
	},
	plugins: []
};
