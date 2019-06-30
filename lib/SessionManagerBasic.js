const SessionManager = require('./SessionManager');
const _sessions = {}; //this object will be the placeholder of our basic session
const _expiration_queue = {}; //this will hold all our expiring sessions
let self;

/**
 * @classdesc
 * SessionManagerBasic is a basic implementation of our SessionManager class which only uses in-memory for holding the session values.
 * This is ideal for small to medium scale projects but larger projects with high volume of users and projects that require high availability of your service will need a detached storage for session.
 * Having such will allow your servers to restore session in an event of a server crash but using in-memory means that the session will be lost with the server.
 * With that, please use this only for small to medium projects where session desconnects do not impact your service and for prototyping
 */
class SessionManagerBasic extends SessionManager{
    
    /**
     * @constructor
     */
    constructor(config) { //start mapping the events to the designated hidden/private functions
        super(config).init({
            on_session_create: onSessionCreate,
            on_session_find: onSessionFind,
            on_session_end: onSessionEnd
        });
        self = this;
    }

}

/**
 * Handles the session creation call. Lets generate a unique user identifier and ensure it has no collision
 * @param {*} config 
 */
function onSessionCreate(config) {
    const date = new Date();
    //lets create some hash based on time and a random value and convert is to a hexadecimal string
    const session_id = (date.getTime() * Math.round(160 * Math.random())).toString(16);
    _sessions[session_id] = { config, value : {} };
    //set expiry for this session which is now plus the TTL
    if (config.ttl) { //if there is a set ttl, mark the expiry datetime
        const expires_on = date.getTime() + (config.ttl || 0);
        _sessions[session_id].expires_on = expires_on;
    }
    return session_id;
}

/**
 * Handles the session retrieval call
 * @param {string} session_id 
 */
function onSessionFind(session_id) {
    const date = new Date();
    if (_sessions[session_id] && _sessions[session_id].expires_on 
        && date.getTime() > _sessions[session_id].expires_on) {
            if ( _sessions[session_id].value && self._config.session_expired_cleanup) {
                _sessions[session_id].value = undefined;
            }
            throw new Error('SESSION_EXPIRED');
    }
    return _sessions[session_id];
}

/**
 * Handles the session termination call
 * @param {string} session_id 
 */
function onSessionEnd(session_id) {
    return delete _sessions[session_id];
}

module.exports = SessionManagerBasic;