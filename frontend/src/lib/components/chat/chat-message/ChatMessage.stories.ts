import type { Meta, StoryObj } from "@storybook/svelte";

import Message from "./ChatMessage.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: "Chat/Message",
	component: Message,
	tags: ["autodocs"],
	argTypes: {
		from: {
			control: { type: "select" },
			options: ["user", "agent"]
		}
	}
} satisfies Meta<Message>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const FromUser: Story = {
	args: {
		from: "user",
		title: "Feedback",
		body: "Some message from the user",
		time: "11:00 PM"
	}
};
