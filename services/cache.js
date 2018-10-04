// set up redis connection
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');


const client = redis.createClient(keys.redisUrl);
// Override callback of get to use promise
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options={}){
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};
// if no changes execute query
mongoose.Query.prototype.exec = async function () {

    if(!this.useCache){
        return exec.apply(this,arguments);
    }
    // access to specific collections
    const key = JSON.stringify
    (Object.assign({},this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    // Check if value for key in redis
    const cacheValue = await client.hget(this.hashKey, key);

    //If yes, return that(expected to see Mongoose model)
    if(cacheValue){
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);

    }

    //if no, exec query and store the result in redis
    const result = await exec.apply(this,arguments);

    client.hset(this.hashKey,key,JSON.stringify(result),'EX',10);

    return result;
};
// Clean hash values
module.exports ={
    cleanHash(hashkey){
       client.del(JSON.stringify(hashkey));
    }
};