import React from "react";
import "./Hero.css";
const Hero = () => {
  return (
    <section class="hero">
      <h1>
        Accessible and Decentralized Real Estate Investment through Blockchain
        Innovation
      </h1>
      <div class="features">
        <div class="feature-card">
          <img
            src="https://demonopol.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffeatures_img01.1b9cf350.png&w=384&q=75"
            style={{ width: "100px", height: "100px" }}
            alt="Fractional Investment Icon"
            class="feature-icon"
          />
         <span>

          <h2>Accessible Fractional Real Estate Investment:</h2>
          <p>Invest from $1 in fractional properties using blockchain.</p>
         </span>
        </div>
        <div class="feature-card">
          <img
            src="https://demonopol.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffeatures_img02.16bd3b6f.png&w=384&q=75"
            alt="Liquid Marketplace Icon"
            class="feature-icon"
            style={{ width: "100px", height: "100px" }}
          />
          <h2>Liquid Real Estate Marketplace:</h2>
          <p>
            Easily buy and sell property fractions, enhancing market liquidity.
          </p>
        </div>
        <div class="feature-card">
          <img
            src="https://demonopol.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffeatures_img02.16bd3b6f.png&w=384&q=75"
            alt="Liquid Marketplace Icon"
            class="feature-icon"
            style={{ width: "100px", height: "100px" }}
          />
          <h2>Strategic Partnerships:</h2>
          <p>
          Collaborate with renowned real estate professionals for reliable and credible investment opportunities.
          </p>
        </div>
        <div class="feature-card">
          <img
            src="https://demonopol.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffeatures_img04.b62720c5.png&w=384&q=75"
            alt="Liquid Marketplace Icon"
            class="feature-icon"
            style={{ width: "100px", height: "100px" }}
          />
          <h2>Community-Driven Property Management:</h2>
          <p>
          Utilize DAO for transparent and collaborative property management decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
