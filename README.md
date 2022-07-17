Very very basic dockerized mail notification app that connects to an eth node and checks if avg gas price is low enough. Uses web3.js

Can be configured through `docker-env.list`, you can change the period for notifications (in hours), or trigger price limit for notification mails (as gwei), or set whom the mails are going to sent to. (comma seperated mail addresses)

Note: Currently mail sending does not work for smtp.gmail.com because Google has discontinued its basic password login for its smtp service as of May 30, 2022. 
