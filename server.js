var CronJob = require('cron').CronJob 
var Mailer = require('./mailer')
var Web3 = require('web3');


var everyNthHour = process.env.PERIOD;


//every 4 hour

if(isNumeric(everyNthHour)){

    try{
        console.log("Periyod bilgisi okundu. " + everyNthHour + " saatte bir olarak alınıyor.");
        var job = new CronJob('0 0 */'+ everyNthHour +' * * *', checkGasPrice, null, false, 'Europe/Istanbul');
        
        job.start();

    }catch(e){
        console.log("CronJob setlenirken hata", e);
    }
}
else{

    try{
            
        console.log("Periyod bilgisi okunmadı, 4 saatte bir olarak alınıyor.");
        var job = new CronJob('0 0 */4 * * *', checkGasPrice, null, false, 'Europe/Istanbul');
        //var job = new CronJob('*/10 * * * * *', checkGasPrice, null, false, 'Europe/Istanbul'); //test every 10th second

        job.start();

    } catch(e){
        console.log("CronJob setlenirken hata", e);    
    }
}




function checkGasPrice(){
    
    var provider = 'https://mainnet.strongblock.com/34675c4172308743ec869ee6eec7c654679270fb';
    var web3Provider = new Web3.providers.HttpProvider(provider);
    var web3Client = new Web3(web3Provider);
    console.log("Eth gas fiyati kontrol ediliyor...");
    web3Client.eth.getGasPrice().then((result) => { sendMail(web3Client.utils.fromWei(result, 'gwei')) });

}

function sendMail(avgGasPrice){

    console.log("Ortalama fiyat: ", avgGasPrice);
    if(avgGasPrice < 32){
        console.log("Ortlama fiyat düşük! Mail gönderiliyor...");
        Mailer.send(avgGasPrice).catch(console.error);
        return;
    }

    console.log("Ortalama fiyat düşük değil mail gönderilmeyecek. Başka sefere inş");
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
