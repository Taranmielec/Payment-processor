import React from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// if you to deploy project on deferent host URL would be different! should be in .env in v2

const API_URL = 'http://loacalhost:4000';

const ITEMS = [
    {
        id: 1,
        price: ethers.utils.parseEther('100')  //price of first object would be 100 DAI but 
    },                                         //becouse of the system o wei

    {
        id: 2,
        praice: ethers.utils.parseEther('200')
    },
];
//receive item as a argument
function Store({ paymentProcessor, dai }) {
    const buy = async item => {
        const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);
        //prove of payment
        const tx1 = await dai.approve(paymentProcessor.address, item.price);
        // we have to wait that transaction will be mained
        await tx1.wait();

        const tx2 = await paymentProcessor.pay(item.price, response1.data.paymentId);
        await tx2.wait(); 
        //we have to make sure that backend will have time to listen a payment from the database or we will condiction 
        
        await new Promise(resolve => setTimeout(resolve, 5000));

        const response2 = await axios.get(`${API_URL}/api/getItemUrl/${response1.data.paymentId}`);
        console.log(response2);
    };

    return (
        <ul className='list-group'>
            <li className='list-group-item'>
                Buy item 1 - <span className='front-weight-bold'>100 DAI</span>
                <button
                type='button'
                className='btn btn-primary float-right'
                onClick={() => buy(ITEMS[0])}
                >
                    Buy
                </button>
            </li>
            <li className='list-group-item'>
                Buy item 2 - <span className='front-weight-bold'>200 DAI</span>
                <button
                type='button'
                className='btn btn-primary float-right'
                onClick={() => buy(ITEMS[1])}
                >
                    Buy
                </button>
            </li>
        </ul>
    );
}

export default Store