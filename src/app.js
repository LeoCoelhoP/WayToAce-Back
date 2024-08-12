const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app = express();
const corsOptions = {
	//Todo Change Origin Later And Create Env Variable
	origin: ['http://localhost:5173', 'http://192.168.3.11:5173'],
	methods: ['GET', 'POST'],
	credentials: true,
	optionsSucessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());
//Todo Check if It Is Necessary in Production
// app.set('trust proxy', 1);

app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const rateLimiter = rateLimit({
	max: process.env.RATE_LIMIT || 3000,
	window: 60 * 60 * 1000, // 1 Hour
	message: 'Too Many Requests From This IP, Please Try Again In An Hour.',
});
app.use(rateLimiter);

app.use(mongoSanitize());
app.use(xss());

app.use('/', routes);

module.exports = app;
