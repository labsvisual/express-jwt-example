'use strict';

function GetCookie( cookieName ) {

    if( !CookieExists( cookieName ) ) {
        return false;
    }

    const cookies = document.cookie.split( ';' ).map( item => item.replace( / /g, '' ) );
    for( let i = 0; i < cookies.length; i++ ) {

        const currentCookie = cookies[ i ];
        if( currentCookie.indexOf( cookieName ) > -1 ) {

            return ( currentCookie.split( '=' )[ 1 ].replace( ' ', '' ) );

        }

    }

}

function CookieExists( cookieName ) {

    return ( document.cookie.indexOf( cookieName ) > -1 );

}

function SubmitForm() {

    const username = document.getElementById( 'username' ).value
        , password = document.getElementById( 'password' ).value;

    const xmlHttp = new XMLHttpRequest();

    if( CookieExists( 'auth-token' ) ) {

        const token = GetCookie( 'auth-token' );

        xmlHttp.open( 'GET', 'http://localhost:3000/test' );
        xmlHttp.setRequestHeader( 'Content-type', `application/json` );
        xmlHttp.setRequestHeader( 'Authorization', `Bearer ${ token }` );

        xmlHttp.onreadystatechange = function() {

            if( xmlHttp.readyState === 4 && xmlHttp.status === 200 ) {

                const data = ( JSON.parse( xmlHttp.responseText ) );
                console.log( data );

            }

        };

        xmlHttp.send( {

            username,
            password,

        } );

    } else {

        xmlHttp.open( 'POST', 'http://localhost:3000/login' );
        xmlHttp.setRequestHeader( 'Content-type', `application/json` );

        xmlHttp.onreadystatechange = function() {

            if( xmlHttp.readyState === 4 && xmlHttp.status === 200 ) {

                document.cookie = `auth-token=${ JSON.parse( xmlHttp.responseText ).token };`;

            }

        };

        xmlHttp.send( JSON.stringify( {

            user: username,
            password,

        } ) );

    }

    return false;

}
