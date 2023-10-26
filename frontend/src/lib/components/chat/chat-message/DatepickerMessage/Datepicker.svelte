<script lang="ts" context="module">
	export type DatepickerOptions = Exclude<
		AirDatepickerOptions,
		| "onSelect"
		| "locale"
		| "visible"
		| "onShow"
		| "onHide"
		| "onRenderCell"
		| "prevHtml"
		| "nextHtml"
	>;

	export type DatepickerSelectEventData = {
		isRange: boolean;
		date: Date | Date[];
		formattedDate: string | string[];
	};

	export type DatepickerSelectEvent = CustomEvent<DatepickerSelectEventData>;
</script>

<script lang="ts">
	import AirDatepicker from "air-datepicker";
	import type { AirDatepickerOptions } from "air-datepicker";
	import "air-datepicker/air-datepicker.css";
	import localeEn from "air-datepicker/locale/en";
	import { createEventDispatcher } from "svelte";

	export let options: DatepickerOptions;

	const dispatchEvent = createEventDispatcher<{
		select: DatepickerSelectEventData;
	}>();

	function datepickerable(element: HTMLDivElement, options: AirDatepickerOptions) {
		// The recast is mandatory because the lib does not have the right type.
		// But it supports HTMLDivElement as well.
		new AirDatepicker(element as HTMLInputElement, {
			locale: localeEn,
			visible: true,
			onSelect: ({
				date,
				formattedDate
			}: {
				date: Date | Date[];
				formattedDate: string | string[];
				datepicker: AirDatepicker;
			}) => {
				if (options.range && Array.isArray(date) && !date[1]) {
					return;
				}

				dispatchEvent("select", {
					isRange: !!options.range,
					date,
					formattedDate
				});
			},
			...options
		});
	}
</script>

<style>
</style>

<div class="datepicker" use:datepickerable={options} />
