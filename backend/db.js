const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://first:12345@blockchain.3esj8.mongodb.net/Data',
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(console.log('Connected to mongo db'))

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
    Payment
};