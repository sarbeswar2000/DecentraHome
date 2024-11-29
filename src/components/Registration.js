import React from 'react';
import { ethers } from 'ethers';

const Registration = ({ escrow, account }) => {
  const registerAsSeller = async () => {
    const signer = escrow.connect(new ethers.providers.Web3Provider(window.ethereum).getSigner());
    await signer.registerAsSeller();
    alert("Registered as Seller!");
  };

  const registerAsBuyer = async () => {
    const signer = escrow.connect(new ethers.providers.Web3Provider(window.ethereum).getSigner());
    await signer.registerAsBuyer();
    alert("Registered as Buyer!");
  };

  return (
    <div className="registration">
      <h3>Register as Buyer or Seller</h3>
      <button onClick={registerAsSeller}>Register as Seller</button>
      <button onClick={registerAsBuyer}>Register as Buyer</button>
    </div>
  );
};

export default Registration;
