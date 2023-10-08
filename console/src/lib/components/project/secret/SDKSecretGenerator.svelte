<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import { Key } from "svelte-hero-icons";
	import { generateSecret } from "$lib/usecases/sdk-secrets/generateSecret";
	import { toastError } from "$lib/utils/toast";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";
	import { projectStore } from "$lib/stores/project";
	import Alert from "$lib/components/common/alert/Alert.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import type { CreatedSdkSecretDto } from "$lib/services/gen-api";

	const project = $projectStore.currentProject;

	if (!project) throw new Error("No project selected");

	let loading = false;

	let generatedSecret: CreatedSdkSecretDto | undefined;
	const generate = async () => {
		try {
			loading = true;
			generatedSecret = await generateSecret(project.id);
		} catch (e: any) {
			toastError(e.message ?? "An error occurred");
		} finally {
			loading = false;
		}
	};
</script>

<div class="">
	<Button loading={loading} leftIcon={Key} on:click={generate}>Generate a new secret key</Button>

	{#if !!generatedSecret}
		<Spacer size="sm" />
		<Alert type="info">
			<div>
				Here is your SDK Secret, please copy it and store it in a safe place. You won't be
				able to see it again.
			</div>
			<Spacer size="sm" />
			<CopiableTag
				value={generatedSecret.clearValue}
				displayedValue={generatedSecret.preview} />
		</Alert>
	{/if}
</div>
