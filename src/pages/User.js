import { ROLES } from "@/constants";
import Authentication from "@/helper/authentication";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UserPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isVerified, setVerified] = useState(false);
  const [userId, setUserId] = useState(0);
  const [shops, setShops] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [error, setError] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verified = await Authentication.verify();
        const { data } = verified;
        const { success, existingUserData } = data;
        if (existingUserData.name) {
          setName(existingUserData.name);
          setWallet(existingUserData.wallet || 0);
          setUserId(existingUserData.id);
        }
        if (success && existingUserData.role === ROLES.USER) {
          const headers = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const getShops = await axios.get("http://localhost:8000/shops");
          console.log("getShops");
          console.log(getShops.data);
          setShops(getShops.data);
          setVerified(true);
        } else if (success && existingUserData.role !== ROLES.USER) {
          console.log("Unauthorized");
          router.push("/UnAuthorised");
        } else {
          router.push("/Login");
        }
      } catch (e) {
        console.log("Error while fetchData: " + e);
      }
    };
    fetchData();
  }, [isVerified]);

  const LogOut = async () => {
    Cookies.remove("token");
    setVerified(false);
    const logOut = await axios.get("http://localhost:8000/authenticate/logOut");
  };

  const handleBuy = async (item) => {
    let walletValue;
    const { name, id, price } = item;
    if (Number(price) > Number(wallet)) {
      setError(true);
    } else {
      try {
        walletValue = wallet - price;
        const headers = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const transaction = await axios.post(
          "http://localhost:8000/api/v1/route/transaction-creation",
          {
            price,
            userId,
            itemId: id,
            walletValue,
          },
          headers // Corrected the order of arguments
        );
        setTransactionStatus(true);
        console.log("transaction");
        console.log(transaction);
        setWallet(walletValue);
      } catch (e) {
        console.log("Transaction failed");
      }
    }
  };

  return (
    <div>
      <h1>Welcome {name} to the Online Store</h1>
      <div>
        <h2>Items List ----- Your Wallet {wallet} </h2>
        {shops.map((item) => (
          <div key={item.id}>
            <br />
            <h3>{item.name}</h3>
            <p>Price: INR {item.price}</p>
            <button onClick={() => handleBuy(item)}>Buy</button>
            {error ? (
              <p>Not enough coins to make the transaction</p>
            ) : null}{" "}
            {transactionStatus ? <p>Success</p> : null}
            <br />
            <br />
            <hr />
          </div>
        ))}
      </div>
      <button onClick={() => LogOut()}>LogOut</button>
    </div>
  );
};

export default UserPage;
