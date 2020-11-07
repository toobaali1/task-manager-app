const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONN_STR, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});



