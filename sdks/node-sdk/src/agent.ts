import { AgentMessageStream } from './agent-message-stream';
import { AttachmentItem, BufferFileAttachment, LocalFileAttachment } from './attachment';
import {
    DEFAULT_INITIAL_MESSAGE_LOADING_DELAY_MS,
    DEFAULT_MESSAGE_TYPING_INTERVAL_MS,
} from './const';
import { localMessageFormatToRemote } from './constants';
import {
    AgentConfig,
    MessageFormat,
    SendEchartOptions,
    SendMessageOptions,
    SendMessagePayload,
    TypewriteMessageOptions,
} from './types';

export class Agent {
    private defaultTypeWriteInterval = DEFAULT_MESSAGE_TYPING_INTERVAL_MS;
    private defaultTypeWriteInitialDelay =
        DEFAULT_INITIAL_MESSAGE_LOADING_DELAY_MS;

    constructor(private readonly config: AgentConfig) {}

	private async uploadAttachment(attachment: AttachmentItem): Promise<any[]> {
		let uploaded: any = null;

		if (attachment instanceof LocalFileAttachment || attachment instanceof BufferFileAttachment) {
			await attachment.load();

			uploaded = await this.config.http.upload('/attachments/uploadSync', attachment.buffer, {
				filename: attachment.filename,
				mimeType: attachment.options?.mimeType,
			})
		}

		if (!uploaded) {
			throw new Error('Failed to upload attachment');
		}

		return uploaded;
	}

	private async uploadAttachments(attachments: AttachmentItem[]): Promise<any[]> {
		return Promise.all(attachments.map((attachment) => this.uploadAttachment(attachment)));
	}

	/**
	 * Send a message that contains a drawn echart, with an optional text added.
	*/
	async echart({ echart, text = '', conversationId, textFormat = 'PlainText' }: SendEchartOptions): Promise<void> {
		this.config.realtime.emit('chat-message', {
            text,
            conversationId,
            format: localMessageFormatToRemote[textFormat],
            agentId: this.config.agentId,
			type: 'ECHART',
			metadata: echart,
			attachments: [],
        });
	}

    async send(
        { text, conversationId, attachments = [] }: SendMessagePayload,
        options: SendMessageOptions = {}
    ) {
		const uploadedAttachments = await this.uploadAttachments(attachments);
        const format: MessageFormat = options.format ?? 'PlainText';

        this.config.realtime.emit('chat-message', {
            text,
            conversationId,
            format: localMessageFormatToRemote[format],
            agentId: this.config.agentId,
			attachments: uploadedAttachments,
			source: 'AGENT',
			type: 'TEXT',
        });
    }

    async typewrite(
        { text, conversationId }: SendMessagePayload,
        options: TypewriteMessageOptions = {
            intervalMs: this.defaultTypeWriteInterval,
            initialDelayMs: this.defaultTypeWriteInitialDelay,
        }
    ) {
        const initialDelay =
            options?.initialDelayMs ?? this.defaultTypeWriteInitialDelay;
        const interval = options?.intervalMs ?? this.defaultTypeWriteInterval;

        const stream = this.createStream({ conversationId }, options);

        if (initialDelay !== 0) {
            await new Promise((resolve) =>
                setTimeout(resolve, options.initialDelayMs)
            );
        }

        await stream.typewrite(text, { intervalMs: interval });

        stream.end();
    }

    createStream(
        { conversationId }: { conversationId: string },
        options: SendMessageOptions = {}
    ): AgentMessageStream {
        return new AgentMessageStream({
            conversationId,
            agentId: this.config.agentId,
            realtime: this.config.realtime,
            format: options.format,
        });
    }

    requestLogin(
        params: {
            conversationId: string;
            text: string;
        },
        options: SendMessageOptions = {}
    ) {
        const format: MessageFormat = options.format ?? 'PlainText';

        this.config.realtime.emit('login-request', {
            conversationId: params.conversationId,
            agentId: this.config.agentId,
            text: params.text,
            format: localMessageFormatToRemote[format],
        });
    }
}
