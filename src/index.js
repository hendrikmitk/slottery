const express = require('express');
const cors = require('cors');
require('dotenv/config');

const app = express();
const port = process.env.PORT || 3000;

/////////////////
// M I D D L E //
/////////////////

app.use(
	cors({
		origin: '*',
		methods: 'GET'
	})
);

/////////////////
// R O U T E S //
/////////////////

app.use('/members', require('./routes/members'));
app.use('/drawing', require('./routes/drawing'));

/////////////////
// L I S T E N //
/////////////////

app.listen(port, () => {
	console.log(`CORS-enabled web server running and listening on port ${port}`);
});
