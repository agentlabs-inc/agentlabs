export type Message = {
	id: string;
	text: string;
	createdAt: Date;
	senderFullName: string;
	senderId: string;
	from: "user" | "agent";
};
