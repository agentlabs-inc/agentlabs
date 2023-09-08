import { Server } from "socket.io";

const io = new Server({});
const port = Number(process.env.PORT || '3000')

io.on("connection", (socket) => {
	console.log('a user connected');

	socket.on('chain_start', (data) => {
		console.log(JSON.stringify(data, null, 2));
	});

	socket.on('chain_end', (data) => {
		console.log(JSON.stringify(data, null, 2));
	});
});

io.listen(port);

console.log(`Server listening on port ${port}`);
