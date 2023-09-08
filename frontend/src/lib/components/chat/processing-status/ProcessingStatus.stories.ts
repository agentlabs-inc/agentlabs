import type { Meta, StoryObj } from "@storybook/svelte";

import ProcessingStatus from "./ProcessingStatus.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: "Chat/ProcessingStatus",
	component: ProcessingStatus,
	tags: ["autodocs"]
} satisfies Meta<ProcessingStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Default: Story = {
	args: {
		content: "Finding a way to proceed..."
	}
};
