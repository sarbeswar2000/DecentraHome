import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Home = ({ home, provider, account, escrow, togglePop }) => {
    const [hasBought, setHasBought] = useState(false);
    const [hasLended, setHasLended] = useState(false);
    const [hasInspected, setHasInspected] = useState(false);
    const [hasSold, setHasSold] = useState(false);

    const [buyer, setBuyer] = useState(null);
    const [lender, setLender] = useState(null);
    const [inspector, setInspector] = useState(null);
    const [seller, setSeller] = useState(null);

    const [owner, setOwner] = useState(null);

    // Fetching details of the home from the updated contract
    const fetchDetails = async () => {

     
        try {
          
           
            const signer = provider.getSigner();
            // Assigning buyer to this property
            const signerAddress = await signer.getAddress();
            // const assignBuyerTx = await escrow.connect(signer).assignBuyer(home.id,signerAddress);
            // console.log("error found");
            // await assignBuyerTx.wait();

            const buyerAddress = await escrow.buyer(home.id);
            setBuyer(buyerAddress);
            console.log("b",buyerAddress);
            const isBought = await escrow.approval(home.id, buyerAddress);
            setHasBought(isBought);
            

            const sellerAddress = await escrow.seller(home.id);
            setSeller(sellerAddress);
            console.log("s",sellerAddress);

            const isSold = await escrow.approval(home.id, sellerAddress);
            setHasSold(isSold);

            const lenderAddress = await escrow.lender();
            setLender(lenderAddress);
            console.log(lenderAddress);

            const isLended = await escrow.approval(home.id, lenderAddress);
            setHasLended(isLended);

            const inspectorAddress = await escrow.inspector();
            setInspector(inspectorAddress);
            console.log(inspectorAddress);

            const isInspected = await escrow.inspectionPassed(home.id);
            setHasInspected(isInspected);
            console.log("all good ");
        } catch (error) {
            console.error("Error fetching details:",error.message);
        }
    };

    // Fetch the owner if the property is no longer listed
    const fetchOwner = async () => {
        try {
            const isListed = await escrow.isListed(home.id);
            if (!isListed) {
                const currentOwner = await escrow.buyer(home.id);
                setOwner(currentOwner);
            }
        } catch (error) {
            console.error("Error fetching owner:", error);
        }
    };

    // Handlers for interacting with the updated smart contract
    const buyHandler = async () => {
        try {

            const escrowAmount = await escrow.escrowAmount(home.id);
            

            // Buyer deposits earnest money
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();
            const assignBuyerTx = await escrow.connect(signer).assignBuyer(home.id,signerAddress);
            console.log("error found");
            await assignBuyerTx.wait();

            let transaction = await escrow.connect(signer).depositEarnest(home.id, {
                value: escrowAmount,
            });
            await transaction.wait();

            // Buyer approves the sale
            transaction = await escrow.connect(signer).approveSale(home.id);
            await transaction.wait();

            setHasBought(true);
        } catch (error) {
            console.error("Error during buy process:", error);
        }
    };

    const inspectHandler = async () => {
        try {
            const signer = provider.getSigner();

            // Inspector updates inspection status
            const transaction = await escrow
                .connect(signer)
                .updateInspectionStatus(home.id, true);
            await transaction.wait();

            setHasInspected(true);
        } catch (error) {
            console.error("Error during inspection:", error);
        }
    };

    const lendHandler = async () => {
        const signer = await provider.getSigner()

        // Lender approves...
        const transaction = await escrow.connect(signer).approveSale(home.id)
        await transaction.wait()

        // Lender sends funds to contract...
        const lendAmount = (await escrow.purchasePrice(home.id) - await escrow.escrowAmount(home.id))
        await signer.sendTransaction({ to: escrow.address, value: lendAmount.toString(), gasLimit: 60000 })

        setHasLended(true)
    };

    const sellHandler = async () => {
        try {
            const signer = provider.getSigner();

            // Seller approves the sale
            let transaction = await escrow.connect(signer).approveSale(home.id);
            await transaction.wait();

            // Seller finalizes the sale
            transaction = await escrow.connect(signer).finalizeSale(home.id);
            await transaction.wait();

            setHasSold(true);
        } catch (error) {
            console.error("Error during sell process:", error);
        }
    };

    useEffect(() => {
        fetchDetails();
        fetchOwner();
    }, [hasSold]);

    return (
        <div className="home">
            <div className="home__details">
                <div className="home__image">
                    <img src={home.image} alt="Home"  style={{"width":"500px","height":"320px"}}/>
                </div>
                <div className="home__overview">
                    <h1>{home.name}</h1>
                    <p>
                        <strong>{home.attributes[2].value}</strong> bds |
                        <strong>{home.attributes[3].value}</strong> ba |
                        <strong>{home.attributes[4].value}</strong> sqft
                    </p>
                    <p>{home.address}</p>

                    <h2>{home.attributes[0].value} ETH</h2>

                    {owner ? (
                        <div className="home__owned">
                            Owned by {owner.slice(0, 6)}...{owner.slice(-4)}
                        </div>
                    ) : (
                        <div>
                            {account === inspector ? (
                                <button
                                    className="home__buy"
                                    onClick={inspectHandler}
                                    disabled={hasInspected}
                                >
                                    Approve Inspection
                                </button>
                            ) : account === lender ? (
                                <button
                                    className="home__buy"
                                    onClick={lendHandler}
                                    disabled={hasLended}
                                >
                                    Approve & Lend
                                </button>
                            ) : account === seller ? (
                                <button
                                    className="home__buy"
                                    onClick={sellHandler}
                                    disabled={hasSold}
                                >
                                    Approve & Sell
                                </button>
                            ) : (
                                <button
                                    className="home__buy"
                                    onClick={buyHandler}
                                    disabled={hasBought}
                                >
                                    Buy
                                </button>
                            )}

                            <button className="home__contact">Contact agent</button>
                        </div>
                    )}

                    <hr />

                    <h2>Overview</h2>
                    <p>{home.description}</p>

                    <hr />

                    <h2>Facts and features</h2>
                    <ul>
                        {home.attributes.map((attribute, index) => (
                            <li key={index}>
                                <strong>{attribute.trait_type}</strong>: {attribute.value}
                            </li>
                        ))}
                    </ul>
                </div>

                <button onClick={togglePop} className="home__close">
                    <img src={close} alt="Close" />
                </button>
            </div>
        </div>
    );
};

export default Home;