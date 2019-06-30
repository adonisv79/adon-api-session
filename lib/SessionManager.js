const EventEmitter = require('events');

module.exports = class SessionManager extends EventEmitter{

    /**
     * @abstract @constructor 
     * @param 
     */
    constructor() {
        super();
    }

    init(config) {
        this._config = config
        if (!config.on_session_create) throw new Error('on_session_create is not provided');
        if (typeof config.on_session_create !== 'function') throw new Error('on_session_create is not a callback function');
        if (!config.on_session_find) throw new Error('on_session_find is not provided');
        if (typeof config.on_session_find !== 'function') throw new Error('on_session_find is not a callback function');
        if (!config.on_session_end) throw new Error('on_session_end is not provided');
        if (typeof config.on_session_end !== 'function') throw new Error('on_session_end is not a callback function');
    }

    /**
     * creates a new session instance and receive a new key
     */
    createSession(config){
        const session_id = this._config.on_session_create(config);
        this.emit('on_session_created', session_id);
        return session_id;
    }

    /**
     * Retrieves (if any) the session object based on the unique session ID
     * @param {string} session_id 
     */
    find (session_id) {
        return this._config.on_session_find(session_id);
    }

    /**
     * Terminates the session id so it can no longer be accessed
     * @param {string} session_id 
     */
    end (session_id) {
        return this._config.on_session_end(session_id);
    }
}