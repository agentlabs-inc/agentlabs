<script lang="ts" xmlns="http://www.w3.org/1999/html">
	type TitleType =
		| "mainTitle"
		| "mainSectionTitle"
		| "sectionTitle"
		| "cardSmallTitle"
		| "subTitle"
		| "label"
		| "body";
	export let type: TitleType;
	export let tag: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "div";

	export let center = false;

	const typeClassMap: Record<TitleType, string> = {
		mainTitle: "text-body-accent dark:text-body-accent-dark font-semibold text-2xl",
		mainSectionTitle: "text-body-accent dark:text-body-accent-dark font-medium text-2xl",
		sectionTitle: "text-body-accent dark:text-body-accent-dark font-medium text-xl",
		cardSmallTitle: "text-sm text-body-base dark:text-body-base-dark text-md",
		subTitle: "text-sm text-body-base dark:text-body-base-dark",
		label: "text-body-subdued dark:text-body-subdued-dark uppercase font-medium text-sm",
		body: "text-sm text-body-base dark:text-body-base-dark"
	};

	const otherClasses = center ? "text-center" : "";
</script>

<svelte:element this={tag} class={`${typeClassMap[type]} ${otherClasses}`}><slot /></svelte:element>
