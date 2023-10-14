import { MessageFormat } from "./types";

export const localMessageFormatToRemote: Record<MessageFormat, string> = {
	PlainText: 'PLAIN_TEXT',
	Markdown: 'MARKDOWN',
}
