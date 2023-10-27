<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import { PaperAirplane } from "svelte-hero-icons";
	import FileUploader from "../file-uploader/FileUploader.svelte";
	import { backendService } from "../../../../services/backend-service";
	import type { MessageAttachment } from "$lib/entities/message/message";
	import { addPendingAttachment, chatStore } from "$lib/stores/chat";

	export let name: string;
	export let placeholder: string;

	export let required = false;
	export let isDisabled = false;
	export let onSubmit: (value: string) => void;

	export let value: string 
	export let inputElement: HTMLTextAreaElement | undefined = undefined;

	export let errors: any | string[] | undefined = undefined;

 	let isUploadingAttachment = false;

	const spacingClass = `py-4 px-6`;
	$: strokeClass = errors?.length ? "border-stroke-error" : "border-stroke-base";

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			onSubmit(value);
		}
	};

	$: console.log($chatStore.pendingAttachments);

	const handleFile = async (file: File) => {
		isUploadingAttachment = true;

		try {
			const uploadedAttachment = await backendService.sendFile<MessageAttachment>('/attachments/uploadSync', file);

			addPendingAttachment(uploadedAttachment);
		} catch (error) {
			console.log(error);
		} finally {
			isUploadingAttachment = false;
		}	
	};

	$: uploadCount = $chatStore.pendingAttachments.length;
</script>

<form class="w-full items-center flex gap-3" on:submit|preventDefault={() => onSubmit(value)}>
	<div class="flex-1 relative">
		<div class="absolute left-4 top-0 bottom-0 flex items-center justify-center">
			<FileUploader uploadCount={uploadCount} handleFile={handleFile} />
		</div>
		<textarea
			on:keydown={handleKeyDown}
			rows={1}
			id={name}
			bind:this={inputElement}
			bind:value={value}
			required={required}
			name={name}
			placeholder={placeholder}
			class="pl-12 resize-none bg-background-primary dark:bg-background-secondary-dark border w-full border-stroke-base dark:border-stroke-base-dark text-body-base dark:text-body-base-dark focus:outline-0 rounded-sm text-sm {spacingClass} {strokeClass} antialiased"
		/>
	</div>
	<Button
		submit
		loading={isDisabled}
		disabled={isDisabled || value.length === 0 || isUploadingAttachment}
		rightIcon={PaperAirplane} 
	/>
</form>
