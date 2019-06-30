const { SessionManagerBasic } = require('../');
const session = new SessionManagerBasic();

//create a new session for 3 users
const user1 = session.createSession({ name: 'Bruce Wayne' });
console.log("User1 created with session id:" + user1);
const user2 = session.createSession({ name: 'Tony Stark' });
console.log("User2 created with session id:" + user2);
//user 3 expires in a few ms
const user3 = session.createSession({ ttl:50 , name: 'Lex Luthor' });
console.log("User3 with 50ms ttl created with session id:" + user3);

//these session ids should be returned to the client. this will be their main identifier in order to get the session object
try {
    console.dir(session.find(user1));
} catch (err) {
    console.error(err.message);
}
try {
    console.dir(session.find(user2));
} catch (err) {
    console.error(err.message);
}
try {
    console.dir(session.find(user3));
} catch (err) {
    console.error(err.message);
}

//lets terminate user session 1 and try to retrieve that
session.end(user1);
console.log("User1 session was killed " + session.find(user1));
// lets delay a bit

setTimeout(afer100ms, 100);

function afer100ms(){
    console.log("retrieving User3 after 100ms delay");
    try {
        console.dir(session.find(user3));
    } catch (err) {
        console.error(err.message);
    }
}