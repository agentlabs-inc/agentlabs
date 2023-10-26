<script lang="ts">
	import { ChatMessagesService } from "$lib/services/gen-api";
	import bytes from "bytes";
	import { CloudArrowDown, Icon, PaperClip } from "svelte-hero-icons";
	import fileSaver from "file-saver";
	import { backendService } from "../../../../services/backend-service";
	import Button from "$lib/components/common/button/Button.svelte";

	export let id: string;
	export let name: string;
	export let sizeBytes: number;
	export let mimeType: string;

	let isHovering = false;
	let isDownloading = false;

	const download = async () => {
		try {
			isDownloading = true;
			const data = await backendService.getFile(`/attachments/downloadById/${id}`);

			fileSaver.saveAs(data, name);
		} catch (e) {
			console.error(e);
		} finally {
			isDownloading = false;
		}
	};

	const getImageSrc = () => {
		return backendService.getImagePreviewUrl(id);
	};

	$: isImage = mimeType?.startsWith("image/");
</script>

{#if isImage}
	<div
		class="relative"
		on:mouseenter={() => (isHovering = true)}
		on:mouseleave={() => (isHovering = false)}>
		<div
			on:click={download}
			class="{!isHovering
				? 'hidden'
				: ''} flex items-center justify-between rounded-md absolute right-3 top-10 bg-background-accent dark:bg-background-accent-dark hover:bg-background-accent/90 hover:dark:bg-background-accent-dark/90">
			<div
				class="flex gap-2 items-center cursor-pointer rounded-md p-2 text-body-accent dark:text-body-accent-dark">
				<Icon class="w-5 h-5" src={CloudArrowDown} />
				<span class="text-body-base dark:text-body-base-dark text-xs">Download</span>
			</div>
		</div>
		<div class="">
			<p
				class="text-body-base dark:text-body-base-dark text-sm text-left text-[11pt] leading-7">
				{name}
			</p>
		</div>
		<img src={getImageSrc()} alt={name} class="max-w-[400px] max-h-[300px] rounded-md" />
	</div>
{:else}
	<button
		on:click={download}
		on:mouseenter={() => (isHovering = true)}
		on:mouseleave={() => (isHovering = false)}
		class="relative antialiased w-[350px] pl-2 pr-6 border border-stroke-base dark:border-stroke-base-dark py-2 rounded-xl flex items-center bg-background-primary dark:bg-background-primary-dark">
		<div
			class="{!isHovering
				? 'hidden'
				: ''} flex items-center justify-between rounded-md absolute right-3 border-stroke-base dark:border-stroke-base-dark bg-background-tertiary dark:bg-background-tertiary-dark">
			<div
				class="cursor-pointer rounded-md bg-background-accent dark:bg-background-accent-dark hover:bg-background-accent/70 hover:dark:bg-background-accent-dark/70 p-2 text-body-accent dark:text-body-accent-dark">
				<Icon class="w-5 h-5" src={CloudArrowDown} />
			</div>
		</div>
		<div
			class="rounded-md bg-stroke-base dark:bg-stroke-base-dark p-2 text-body-accent dark:text-body-accent-dark">
			<Icon class="w-5 h-5" src={PaperClip} />
		</div>

		<div class="ml-3">
			<p
				class="text-body-accent dark:text-body-accent-dark text-sm text-left text-[11pt] leading-7">
				{name}
			</p>

			{#if isHovering && !isDownloading}
				<div
					class="flex justify-between items-center text-body-subdued dark:text-body-subdued-dark text-xs">
					Download
				</div>
			{:else}
				<div
					class="flex gap-2 items-center text-body-subdued dark:text-body-subdued-dark text-xs">
					<div class="text-left">
						{mimeType}
					</div>
					{" "}
					<div>
						{bytes(sizeBytes)}
					</div>
				</div>
			{/if}
		</div>
	</button>
{/if}
