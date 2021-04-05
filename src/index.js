const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configuring CORS middleware
app.use(
	cors({
		origin: '*',
		methods: 'GET'
	})
);

app.use(express.json());

/////////////////
// R O U T E S //
/////////////////

app.get('/', (req, res) => {
	res.status(200).json({
		code: res.statusCode,
		status: 'OK',
		description: 'Hello World!',
		data: {}
	});
});

/////////////////
// L I S T E N //
/////////////////

app.listen(port, () => {
	console.log(`CORS-enabled web server running and listening on port ${port}`);
});
