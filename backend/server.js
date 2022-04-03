const Koa = require('Koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require ('../frontend/src/contracts/PaymentProcessor.json');
const { Payment } = require ('./db.js');

const app = new Koa();
const router = new Router();

// hard item structure (another one in monodb)

const items = {
 '1' : {id: 1, url: 'http://UrlToDownloadItem1'},
 '2' : {id: 2, url: 'http://UrlToDownloadItem1'},

};

// first endpoint for monodb

router.get('/api/getPaymentId/:itemId', async ctx => {
    const paymentId = (Math.random() * 10000).toFixed(0);
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid: false
    });
    ctx.body = {
        paymentId
    };
});

// secound endpoint for monodb

router.get('/api/getItemUrl/:paymentId', async ctx => {
    const payment = await Payment.findOne({id: ctx.params.paymentId});
    if(payment && payment.paid === true) {
        ctx.body = {
            url: items[payment.itemId].url
        };
     } else {
        ctx.body = {
             url: ''
         };
     }
});

// app router

app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());

// server port

app.listen(4000, () => {
    console.log('Server running on port 4000');
});    
// if you want to deploy server on test or main network you need to chcange
// localhost and networkId

const listenToEvents = () => {
    const provider = new ethers.providers.JsonRpcProvider('http://localhoste:9545');
    const networkId = '5777';

// contract object that has: 1) contract address, 2) contract abi created 
// after migration 3) ethers provider

    const paymentProccessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    );

// now we can listen to event of paymentProcessor object
// name of event is PaymentDone

// data is tricky becouse timestamp in solidity is in secound but
// in milisecounds, thats why we need to multiply 1000
// then for human frendly represantatnion we use toLoacaleString

    paymentProccessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
        console.log(`
            from ${payer}
            amount ${amount}
            paymentId ${paymentId}
            date ${(new Date(data.toNumber() * 1000)).toLocaleString()}
        `);
// if this payment already exist in database we can set payment status
    
    const payment = await Payment.findOne({id: paymentId});
        if(payment) {
            payment.paid = true;
            await payment.save();
        }
    });
};
listenToEvents();