import React from "react";
import "./Advertisement.css";
const Advertisement = () => {
  return (
    <>
      <div class="container">
        <h1>The fastest and easiest way to sell your home</h1>
        <div class="cards">
          <div class="card">
            <div class="icon">
              <img src="https://d1xt9s86fx9r45.cloudfront.net/assets/hl-production/packs/media/components/icons/purchase-price-772382e79d22664be34b77438a5fcc1a.png" alt="Offer Icon"/>
            </div>
            <h2>Get our best offer</h2>
            <p>
              We use neighborhood data and local market experts to present the
              best offer to you. There’s no upfront cost for repairs and we
              never charge a program fee or closing costs.
            </p>
          </div>
          <div class="card">
            <div class="icon">
              <img src="https://d1xt9s86fx9r45.cloudfront.net/assets/hl-production/packs/media/components/icons/choose-date-b9ae74b57c52d9f2dc1fb22c849cd9c9.png" alt="Calendar Icon"/>
            </div>
            <h2>Sell when you're ready</h2>
            <p>
              There's no need to prep. When you're ready, our dedicated Client
              Advisor will take care of everything.
            </p>
          </div>
          <div class="card">
            <div class="icon">
              <img src="https://d1xt9s86fx9r45.cloudfront.net/assets/hl-production/packs/media/components/icons/work-together-260856c01ace9309ce6f10567d0bef3c.png" style={{"width":"70px","height":"70px"}}alt="Handshake Icon"/>
            </div>
            <h2>Sell fast and confidently</h2>
            <p>We can put cash in your hand in as few as 10 days.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Advertisement;
