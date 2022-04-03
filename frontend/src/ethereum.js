// file that makes conection to the blockchain

import { ethers, Contract } from 'ethers';

// in truffle confing file on module exports we use command to move contract json file
// to 1 lever higher to resolve the issue with react directory construction
// * re-migrate with reset

import PaymentProcessor from './contracts/PaymentProcessor'
import Dai from './contracts/Dai.json';

// funcion make conection to ethereum, return a promise that
// resolve method check if everythig is loaded

const getBlockchain = () =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if(window.ethereum) {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                //this will be able to send transactions

                const signer = provider.getSigner();

                // object is able to contat with smartcontract (similar to backend)

                const paymentProcessor = new Contract(
                    PaymentProcessor.networks[window.ethereum.networkVersion].address, // you can use method getNetwork but it is diferent then ganache?
                    PaymentProcessor.abi,
                    signer
                );

                const dai = new Contract(
                    Dai.networks[window.ethereum.networkVersion].address,
                    Dai.abi,
                    signer
                );
                resolve({ provider, paymentProcessor, dai }); // if everything is well you can interact with blockchain
            }
            reject({ provider: undefined, paymentProcessor: undefined, dai: undefined}); // if it is not will return empty object
                                                                                    //smart thing would be that to use try and cach to show some error in v2
        })
    });

    export default getBlockchain