import type { Meta, StoryObj } from "@storybook/svelte";

import Avatar from "./Avatar.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: "Common/Avatar",
	component: Avatar,
	tags: ["autodocs"]
} satisfies Meta<Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Basic: Story = {
	args: {
		alt: "Some user profile image",
		src: "https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A"
	}
};
