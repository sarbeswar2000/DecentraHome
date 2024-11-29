import React, { useState } from "react";
import "./showcase.css"; // Import your CSS file

const Showcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: "Sold in under 13 days",
      img: "house1.jpg",
      price: "$1,675,000",
      address: "7146 E Mezzanine Way, Long Beach, CA",
      details: ["🛏️ 4", "🛁 3", "📐 1539 sq ft"],
    },
    {
      badge: "Sold in under 2 days",
      img: "house2.jpg",
      price: "$1,900,000",
      address: "318 Avenue F, Redondo Beach, CA",
      details: ["🛏️ 3", "🛁 2", "📐 1479 sq ft"],
    },
    {
      badge: "Sold in under 1 day",
      img: "house3.jpg",
      price: "$985,000",
      address: "123 Tassie Way, Socorro, TX",
      details: ["🛏️ 2", "🛁 1", "📐 928 sq ft"],
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div class="container">
      <h1>
        Recently Sold with Simple Sale<sup>®</sup>
      </h1>

      <div class="property-grid">
        {/* <!-- Property Card 1 --> */}
        <div class="property-card">
          <div class="image-container">
            <span class="badge">Sold in under 13 days</span>
            <img
              src="https://mls-media.homelight.com/sandicor/property/image/property_image_Sandicor_306284732/property_image_Sandicor_306284732_0.jpg?width=518&height=342&fit=cover&auto=webp&optimize=medium&format=pjpg"
              alt="House 1"
            />
          </div>
          <div class="details">
            <h2>$1,675,000</h2>
            <p>7146 E Mezzanine Way, Long Beach, CA</p>
            <ul>
              <li>🛏️ 4</li>
              <li>🛁 3</li>
              <li>📐 1539 sq ft</li>
            </ul>
          </div>
        </div>

        {/* <!-- Property Card 2 --> */}
        <div class="property-card">
          <div class="image-container">
            <span class="badge">Sold in under 2 days</span>
            <img
              src="https://mls-media.homelight.com/sandicor/property/image/property_image_Sandicor_306297761/property_image_Sandicor_306297761_0.jpg?width=518&height=342&fit=cover&auto=webp&optimize=medium&format=pjpg"
              alt="House 2"
            />
          </div>
          <div class="details">
            <h2>$1,900,000</h2>
            <p>318 Avenue F, Redondo Beach, CA</p>
            <ul>
              <li>🛏️ 3</li>
              <li>🛁 2</li>
              <li>📐 1479 sq ft</li>
            </ul>
          </div>
        </div>

        {/* <!-- Property Card 3 --> */}
        <div class="property-card">
          <div class="image-container">
            <span class="badge">Sold in under 1 day</span>
            <img
              src="https://mls-media.homelight.com/sandicor/property/image/property_image_Sandicor_306274232/property_image_Sandicor_306274232_0.jpg?width=518&height=342&fit=cover&auto=webp&optimize=medium&format=pjpg"
              alt="House 3"
            />
          </div>
          <div class="details">
            <h2>$985,000</h2>
            <p>123 Tassie Way, Socorro, TX</p>
            <ul>
              <li>🛏️ 2</li>
              <li>🛁 1</li>
              <li>📐 928 sq ft</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
