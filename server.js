
var mailer = require('./mailer')
var Web3 = require('web3');
var provider = 'https://mainnet.strongblock.com/34675c4172308743ec869ee6eec7c654679270fb';

var web3Provider = new Web3.providers.HttpProvider(provider);


var web3 = new Web3(web3Provider);

/*
web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
});

web3.eth.getBalance('0x477FbcFC1891eA8A3c9245c6750003275DFaAEF0')
        .then(balance => console.log('Your balance is: ' , balance));

web3.eth.getGasPrice()
        .then((result) => {
                console.log("Average gas price is: ", web3.utils.fromWei(result, 'gwei'))
            })

*/

web3.eth.getGasPrice().then((result) => { sendMail(web3.utils.fromWei(result, 'gwei')) });


function sendMail(avgGasPrice){

    console.log("Ortalama fiyat: ", avgGasPrice);
    if(avgGasPrice < 32){
        console.log("Ortlama fiyat düşük! Mail gönderiliyor...");
        mailer.send(avgGasPrice).catch(console.error);
        return;
    }

    console.log("Ortalama fiyat düşük değil mail gönderilmeyecek. Başka sefere inş");
}
