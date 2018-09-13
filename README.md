### Blog App
    This blog app is build on top of NodeJS with Express on server side and React for client side.
    Uses Redux for state management and Redis for server caching.
### How to install app:
    npm i || yarn 
    cd client && npm i || yarn
### How to run app:
    To run server: npm || yarn run start
    To run server in dev mode: npm || yarn run server
    To run client: npm || yarn run start --prefix client
    To run both: npm || yarn run dev
### To run tests:
    npm run test
### Note:
    In order to run app correctly you need to add dev.js to config folder.
    Which has to contain GoogleClientID,GoogleClientSecret(for Oath in Google).
    Also MongoURI(This project is using m-lab) and cookieKey.
    
        
