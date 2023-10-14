<script lang="ts">
import { fetchMessages } from "$lib/usecases/chat/fetch-messages";
import { conversationStore } from "$lib/stores/conversation";

export let data: { conversationId: string };

const load = async (conversationId: string) => {
	const isConversationAlreadyLoaded = $conversationStore.selectedConversationId === conversationId;

	if (isConversationAlreadyLoaded) {
		return;
	}

	await fetchMessages(data.conversationId);
	$conversationStore.selectedConversationId = conversationId;
}

$: load(data.conversationId);

</script>
