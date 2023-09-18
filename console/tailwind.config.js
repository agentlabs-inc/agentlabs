import defaultTheme from "tailwindcss/defaultTheme";
import tailwindCssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans]
			},
			colors: {
				// Colors for background in all situations
				"background-primary": "#FAFAFF",
				"background-secondary": "#ffffff",
				"background-tertiary": "#ffffff",
				"background-quaternary": "#E5E7EB",
				"background-accent": "#F2F2F8",
				"background-success": "#00C48C",
				"background-error": "#ef434b",
				"background-warning": "#fff6e0",
				"background-info": "#272A3A",

				// Colors for background in all situations
				"background-primary-dark": "#141420",
				"background-secondary-dark": "#161622",
				"background-tertiary-dark": "#1B1B27",
				"background-quaternary-dark": "#2e2e41",
				"background-accent-dark": "#272A3A",
				"background-success-dark": "#00C48C",
				"background-error-dark": "#ef434b",
				"background-warning-dark": "#342e17",
				"background-info-dark": "#272A3A",

				// Colors for text elements
				"body-base": "#616A7B",
				"body-secondary": "#616A7B",
				"body-subdued": "#616A7B",
				"body-accent": "#383C4E",
				"body-info": "#FAFAFF",
				"body-error": "#DB1A5B",
				"body-warning": "#5d5440",
				"body-success": "#00C48C",

				// Colors for text elements
				"body-base-dark": "#C5C8D8",
				"body-secondary-dark": "#C5C8D8",
				"body-subdued-dark": "#616A7B",
				"body-accent-dark": "#F2F2F8",
				"body-info-dark": "#FAFAFF",
				"body-error-dark": "#DB1A5B",
				"body-warning-dark": "#d9d6c9",
				"body-success-dark": "#00C48C",

				// Colors for borders
				"stroke-base": "#F2F2F8",
				"stroke-accent": "#d4d4db",
				"stroke-info": "#016AD4",
				"stroke-error": "#DB1A5B",
				"stroke-warning": "#F58801",
				"stroke-success": "#00C48C",

				// Colors for borders
				"stroke-base-dark": "#272A3A",
				"stroke-accent-dark": "#383C4E",
				"stroke-info-dark": "#016AD4",
				"stroke-error-dark": "#DB1A5B",
				"stroke-warning-dark": "#F58801",
				"stroke-success-dark": "#00C48C",

				// Colors for buttons
				"button-bg-primary": "#1C4ED8",
				"button-bg-secondary": "#2C3442",
				"button-bg-disabled": "#454C59",
				"button-bg-accent": "#ef434b",
				"button-bg-destructive": "#DB1A5B",
				"button-bg-success": "#00C48C",

				"button-bg-primary-dark": "#1C4ED8",
				"button-bg-secondary--dark": "#2C3442",
				"button-bg-disabled--dark": "#454C59",
				"button-bg-accent--dark": "#ef434b",
				"button-bg-destructive--dark": "#DB1A5B",
				"button-bg-success--dark": "#00C48C",

				// Colors for button-icon
				"button-icon-primary": "#FFFFFF",
				"button-icon-secondary": "#D2D2D2",
				"button-icon-disabled": "#858585",
				"button-icon-accent": "#FFFFFF",
				"button-icon-destructive": "#FFFFFF",
				"button-icon-success": "#FFFFFF",

				// Colors for button-label
				"button-label-primary": "#FAFAFF",
				"button-label-secondary": "#FAFAFF",
				"button-label-disabled": "#FAFAFF",
				"button-label-accent": "#FFFFFF",
				"button-label-destructive": "#FFFFFF",
				"button-label-success": "#FFFFFF"
			}
		}
	},
	plugins: [tailwindCssAnimate]
};
