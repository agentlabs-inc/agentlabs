import type { Preview } from "@storybook/svelte";

import { withThemeByClassName } from "@storybook/addon-styling";

import "../src/app.css";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		}
	},

	decorators: [
		// Adds theme switching support.
		// NOTE: requires setting "darkMode" to "class" in your tailwind config
		withThemeByClassName({
			themes: {
				light: "light",
				dark: "dark"
			},
			defaultTheme: "light"
		})
	]
};

export default preview;
