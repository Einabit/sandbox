const net = require("net");

const client = new net.Socket();
client.connect(1337, "127.0.0.1", () => {
	client.write("fetch,auto1,1671801250925,1671801257928");
});

client.pipe(process.stdout);
