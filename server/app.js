import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";


const catalogRouter = require("./routes/catalog"); // Import routes for "catalog" area of site

import compression from "compression";
import helmet from "helmet";

const app = express();

// Set up rate limiter: maximum of twenty requests per minute
import RateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const limiter = RateLimit({
    windowMs: 1 * 10 * 1000, // 10 seconds
    max: 10,
  });
  // Apply rate limiter to all requests
  app.use(limiter);

async function main() {
    try {
        await prisma.$connect();
        console.log('database connect successfully');
    } catch(err) {
        console.error('failed to connect db',err);
        process.exit(1);
    }
}

main().catch((err) => console.error('an error ocurred', err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            'script-src': ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    })
);

app.use(compression());

app.use(express.static(path.join(__dirname, "../public")));

app.use('/catalog', catalogRouter);

app.use(function(req,res,next) {
    next(createError(404));
});

app.use(function(err,req,res,next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;