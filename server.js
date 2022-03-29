var CronJob = require('cron').CronJob
var Mailer = require('./mailer')
var Web3 = require('web3');

var provider;
var web3Provider;
var web3Client;

var everyNthHour = process.env.PERIOD;
var avgGasPriceLimit = 130;

if (isNumeric(process.env.PRICELIMIT)) {
  console.log("Gas limit bilgisi okundu: " + process.env.PRICELIMIT);
  avgGasPriceLimit = process.env.PRICELIMIT;
}

checkGasPrice();

// start job for every Nth hour

if (isNumeric(everyNthHour)) {

  try {
    console.log("Periyod bilgisi okundu. " + everyNthHour +
                " saatte bir olarak alınıyor.");
    var job = new CronJob('0 0 */' + everyNthHour + ' * * *', checkGasPrice,
                          null, false, 'Europe/Istanbul');

    job.start();
    console.log("job başlatıldı.");

  } catch (e) {
    console.log("CronJob setlenirken hata", e);
  }
} else {

  try {

    console.log("Periyod bilgisi okunmadı, 30 saniyede bir olarak alınıyor.");
    var job = new CronJob('*/30 * * * * *', checkGasPrice, null, false,
                          'Europe/Istanbul'); // test every 30th second

    job.start();

    console.log("job başlatıldı.");

  } catch (e) {
    console.log("CronJob setlenirken hata", e);
  }
}

function checkGasPrice() {

  provider =
      'https://mainnet.strongblock.com/34675c4172308743ec869ee6eec7c654679270fb';
  web3Provider = new Web3.providers.HttpProvider(provider);
  web3Client = new Web3(web3Provider);
  console.log("Eth gas fiyati kontrol ediliyor...");

  let avgGasPricePromise = web3Client.eth.getGasPrice();
  let lastBlockNumberPromise = web3Client.eth.getBlockNumber();

  Promise.all([ avgGasPricePromise, lastBlockNumberPromise ])
      .then((values) => { sendMail(values[0], values[1]); });
}

function sendMail(avgGasPrice, lastBlockNumber) {

  let avgGasPriceGwei = web3Client.utils.fromWei(avgGasPrice, 'gwei');
  console.log("Ortalama fiyat: " + avgGasPriceGwei + " gwei");
  console.log("Son blok: " + lastBlockNumber);

  if (parseInt(avgGasPriceGwei, 10) < parseInt(avgGasPriceLimit, 10)) {
    console.log("Ortlama fiyat limit olan " + avgGasPriceLimit +
                " gwei'den düşük! Mail gönderiliyor...");
    Mailer.send(avgGasPriceGwei, lastBlockNumber).catch(console.error);
    return;
  }

  console.log(
      "Ortalama fiyat düşük değil mail gönderilmeyecek. Başka sefere inş");
}

function isNumeric(str) {
  if (typeof str != "string")
    return false          // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the
                          // string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
