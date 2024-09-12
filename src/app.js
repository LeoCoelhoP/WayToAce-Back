const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');

const app = express();

const corsOptions = {
  origin: 'https://waytoace.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSucessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());
app.set('trust proxy', 1);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const rateLimiter = rateLimit({
  max: process.env.RATE_LIMIT || 3000,
  window: 60 * 60 * 1000, // 1 Hour
  message: 'Too Many Requests From This IP, Please Try Again In An Hour.',
});
app.use(rateLimiter);

app.use(mongoSanitize());
app.use(xss());

// Passport Initialization
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'None', secure: true }, // 3 Days
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

module.exports = app;
