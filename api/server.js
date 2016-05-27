import express from 'express';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import cors from 'cors';

// This is the middleware for express to use JWT.
import ExpressJwt from 'express-jwt';

// A simple library to consume the JWT algorithm.
import jwt from 'jsonwebtoken';

const app = express()
    , secret = 'F7VukpJLK3nhjHz1dCt9';

app.use( BodyParser.json() );
app.use( CookieParser() );
app.use( cors() );

// The middleware needs to know the secret for verifying the signature.
app.use( ExpressJwt( {

    secret,

} ).unless( {

    path: [

        {

            url: '/login',
            methods: [ 'GET', 'POST' ]

        }

    ]

} ) );

// This is a protected route. The header has to contain the following:
// Authorization Bearer <JWT TOKEN>
app.get( '/test', ( req, res ) => {

    // Following what I said above, we need the token; so, we split it.
    const [ , token ] = req.headers.authorization.split( ' ' )
        // First we verify if the token is valid.
        , isValid = jwt.verify( token, secret );

    res.send( {

        // Some protected resource
        hello: 'world',

        // This is just to show you that you can get the objects you have stored in your JWT.
        [ isValid ? 'payload' : 'invalid' ]: ( isValid ? jwt.decode( token ) : false )

    } );

} );

app.post( '/login', ( req, res ) => {

    // Generate a simple token. The really basic parameters are used here.
    // The first object is the payload. You can later decode this and consume it.
    const token = jwt.sign( {

        user: req.body.user

    }, secret );

    // For demonstration purposes, I will just send the token.
    res.send( {

        token,

    } );

} );

app.listen( 3000, () => {

    console.log( 'Application server started at port 3000.' );

} );
