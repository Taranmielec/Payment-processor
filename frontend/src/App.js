import React, { useState, useEffect } from 'react'; //useState and useEffect is fuction that usefull when you have to wait for something to load in async
import Store from './Store.js';
import getBlockchain from './ethereum.js';


function App() {
  const [paymentProcessor, setPaymentProcessor] = useState(undefined)
  const [dai, setDai] = useState(undefined);



  useEffect(() => {
    const init = async () => {
      const { paymentProcessor, dai} = await getBlockchain();
      setPaymentProcessor(paymentProcessor);
      setDai(dai);
    }               //that means we can use dai and paymentProcessor
      init();                    
  }, []);
      // now have to check if metamask was install

    if(typeof window.ethereum === 'undefined') {
      return (
        <div className='container'>
          <div className='col-sm-12'>
            <h1>Blockchain Ecommerce App</h1>
            <p>You need to install the latest version of Metamask</p>
          </div>
        </div>
      );
    }
        //if everything is well we return normal html

  return (
    <div className='container'>
      <div className='col-sm-12'>
        <h1>Blockchain Ecommerce App</h1>
          <Store paymentProcessor={paymentProcessor} dai={dai}/>
      </div>
     Hello World
    </div>
  );
}

export default App;
