<script lang="ts">
	import CopiableCell from "$lib/components/common/table/CopiableCell.svelte";
	import Table from "$lib/components/common/table/Table.svelte";
	import type { TableColumn } from "$lib/components/common/table/types";
	import { projectStore } from "$lib/stores/project";
	import dayjs from "dayjs";
	import { onMount } from "svelte";
	import { fetchSecrets } from "$lib/usecases/sdk-secrets/fetchSecrets";
	import { revokeSecret } from "$lib/usecases/sdk-secrets/revokeSecret";
	import ButtonCell from "$lib/components/common/table/ButtonCell.svelte";
	import { Key } from "svelte-hero-icons";
	import Button from "$lib/components/common/button/Button.svelte";
	import { generateSecret } from "$lib/usecases/sdk-secrets/generateSecret";
	import { toastError } from "$lib/utils/toast";
	import Alert from "$lib/components/common/alert/Alert.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";
	import type { CreatedSdkSecretDto, SanitizedSdkSecretDto } from "$lib/services/gen-api";
	import type { SanitizedSdkSecret, SdkSecret } from "$lib/entities/sdk-secret/sdk-secret";

	type SecretRow = {
		id: string;
		preview: string;
		description: string | null;
		createdAt: Date;
		action: {
			label: string;
			onClick: () => void;
			type: "danger";
		};
	};

	const columns: TableColumn<SecretRow, keyof SecretRow>[] = [
		{
			name: "ID",
			key: "id",
			customComponent: CopiableCell
		},
		{
			name: "Preview",
			key: "preview"
		},
		{
			name: "description",
			key: "description"
		},
		{
			name: "Created at",
			key: "createdAt",
			format: (secret: SecretRow) =>
				dayjs(secret.createdAt).format("MMMM D, YYYY [at] h:mm A")
		},
		{
			name: "Action",
			key: "action",
			customComponent: ButtonCell
		}
	];

	const secretToRow = (secret: SanitizedSdkSecretDto | SdkSecret): SecretRow => {
		return {
			id: secret.id,
			preview: secret.preview,
			description: secret.description ?? "-",
			createdAt: new Date(secret.createdAt),
			action: {
				label: "Revoke",
				type: "danger",
				onClick: async () => {
					const ok = await confirm("Are you sure you want to revoke this secret?");
					if (!ok) {
						return;
					}
					await revokeSecret(secret.id);
					rows = rows.filter((row) => row.id !== secret.id);
				}
			}
		};
	};

	let rows: SecretRow[] = [];
	const projectId = $projectStore.currentProjectId;

	if (!projectId) {
		throw new Error("No project id");
	}

	let isLoadingData = false;

	onMount(async () => {
		if (!projectId) {
			return;
		}

		try {
			isLoadingData = true;
			const { items } = await fetchSecrets(projectId);
			rows = items.map(secretToRow);
		} finally {
			isLoadingData = false;
		}
	});

	let generatedSecret: CreatedSdkSecretDto | undefined;
	let loading = false;
	const generate = async () => {
		try {
			loading = true;
			generatedSecret = await generateSecret(projectId);
			if (!generatedSecret) {
				return;
			}
			rows = [...rows, secretToRow(generatedSecret)];
		} catch (e: any) {
			toastError(e.message ?? "An error occurred");
		} finally {
			loading = false;
		}
	};

	$: rowsLength = rows.length;
</script>

<div class="w-full p-10 pb-32">
	<div class="max-w-6xl m-auto mt-10">
		<div class="flex justify-end">
			<Button loading={loading} leftIcon={Key} on:click={generate}
				>Generate a new secret key</Button>
		</div>
		<Spacer size="sm" />
		{#if !!generatedSecret}
			<Spacer size="sm" />
			<Alert type="info">
				<div>
					Here is your SDK Secret, please copy it and store it in a safe place. You won't
					be able to see it again.
				</div>
				<Spacer size="sm" />
				<CopiableTag
					value={generatedSecret.clearValue}
					displayedValue={generatedSecret.clearValue} />
			</Alert>
			<Spacer size="sm" />
		{/if}
		<Table
			isLoadingData={isLoadingData}
			totalCount={rowsLength}
			columns={columns}
			rows={rows}
			emptyTitle="No secret"
			emptyDescription="Create your first secret now">
			<Button slot="empty-state-actions" loading={loading} leftIcon={Key} on:click={generate}
				>Generate a new secret key</Button>
		</Table>
	</div>
</div>
