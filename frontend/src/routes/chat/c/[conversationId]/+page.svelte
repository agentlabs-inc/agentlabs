<script lang="ts">
import { fetchMessages } from "$lib/usecases/chat/fetch-messages";
import { conversationStore } from "$lib/stores/conversation";
import { page } from "$app/stores";

$: conversationId = $page.params.conversationId

const load = async (conversationId: string) => {
	const isConversationAlreadyLoaded = $conversationStore.selectedConversationId === conversationId;

	if (isConversationAlreadyLoaded) {
		return;
	}

	await fetchMessages(conversationId);
	$conversationStore.selectedConversationId = conversationId;
}

$: load(conversationId);

</script>
