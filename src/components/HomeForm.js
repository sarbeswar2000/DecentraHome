import React, { useState } from "react";
import "./HomeForm.css";
import { ethers } from "ethers";
import realEstateABI from "./../abis/RealEstate.json";
import escrowABI from "./../abis/Escrow.json";

const HomeForm = ({ account }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    yearBuilt: "",
    address: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Upload Image to IPFS
      const fileData = new FormData();
      fileData.append("file", formData.image);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: "55d158213c2cb5f612bc",
            pinata_secret_api_key:
              "bddf6c116e4dac669416c87d022c1eebfd6b5eb0f22ec4ef5e264cbdc8d118c5",
          },
          body: fileData,
        }
      );

      const responseData = await response.json();
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${responseData.IpfsHash}`;

      // Step 2: Interact with Smart Contract
      const realEstateAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const escrowAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Create contract instances
      const realEstateContract = new ethers.Contract(
        realEstateAddress,
        realEstateABI,
        signer
      );

      // Retrieve the latest minted token ID
      const tokenId = await realEstateContract.totalSupply();
      const tokenIdNumber = tokenId.toNumber(); // Convert BigNumber to number
      console.log("Token minted with ID:", tokenIdNumber);

      // Step 3: Upload Metadata to IPFS with Token ID
      const metadata = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        image: fileUrl,
        id: tokenIdNumber,
        attributes: [
          {
            trait_type: "Purchase Price",
            value: formData.price,
          },
          {
            trait_type: "Type of Residence",
            value: formData.type,
          },
          {
            trait_type: "Bed Rooms",
            value: formData.bedrooms,
          },
          {
            trait_type: "Bathrooms",
            value: formData.bathrooms,
          },
          {
            trait_type: "Square Feet",
            value: formData.sqft,
          },
          {
            trait_type: "Year Built",
            value: formData.yearBuilt,
          },
        ],
      };

      const metadataResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: "55d158213c2cb5f612bc",
            pinata_secret_api_key:
              "bddf6c116e4dac669416c87d022c1eebfd6b5eb0f22ec4ef5e264cbdc8d118c5",
          },
          body: JSON.stringify(metadata),
        }
      );

      const metadataData = await metadataResponse.json();
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;

      console.log("Metadata URL:", metadataUrl);
     
      
    const mintTx = await realEstateContract.mint(metadataUrl);
    await mintTx.wait();


      // Approve Escrow contract to transfer NFT
      const approveTx = await realEstateContract
        .connect(signer)
        .approve(escrowAddress, tokenId);
      await approveTx.wait();

      // List property on Escrow contract
      const escrowContract = new ethers.Contract(
        escrowAddress,
        escrowABI,
        signer
      );
      // List the property on RealEstate contract.
      

      // 
      const listTx = await escrowContract.connect(signer).list(
        tokenId,
        ethers.utils.parseEther(formData.price),
        ethers.utils.parseEther((formData.price / 2).toString())// Example escrow amount
      );
      await listTx.wait();

      alert(
        `Property successfully listed for sale! Token ID: ${tokenIdNumber}`
      );
    } catch (err) {
      console.error("Error:", err);
      alert("Error during submission. Please check the console for details.");
    }
  };

  return (
    <div className="home-form">
      <h2>Submit Home Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property's Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Property's name"
            required
          />
        </div>
        <div className="form-group">
          <label>Purchase Price (ETH):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price in ETH"
            required
          />
        </div>

        <div className="form-group">
          <label>Type of Residence:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., Single family residence"
            required
          />
        </div>

        <div className="form-group">
          <label>Bedrooms:</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Enter number of bedrooms"
            required
          />
        </div>

        <div className="form-group">
          <label>Bathrooms:</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Enter number of bathrooms"
            required
          />
        </div>

        <div className="form-group">
          <label>Square Feet:</label>
          <input
            type="number"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            placeholder="Enter square footage"
            required
          />
        </div>

        <div className="form-group">
          <label>Year Built:</label>
          <input
            type="number"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            placeholder="Enter year built"
            required
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter property address"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter home description"
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img
              src={imagePreview}
              alt="Property"
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HomeForm;
