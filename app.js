import Express from 'express';
import ExpressSession from 'express-session';
import CookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import Path from 'path';
import Logger from 'morgan';
import Mongoose from 'mongoose';

import * as Config from "./config";
import api_v1 from "./api/api_v1";

const app = Express();

// view engine setup
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Logger('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));
app.use(CookieParser('sessionSecret'));
app.use(ExpressSession({
    secret: 'sessionSecret',
    resave: true,
    saveUninitialized:true
}));

app.use(Express.static(Path.join(__dirname, 'public')));

app.use('/api/v1', api_v1);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.status + ' error');
});

Mongoose.connect(Config.DATABASE);
Mongoose.connection.on('error', function () {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

export default app;