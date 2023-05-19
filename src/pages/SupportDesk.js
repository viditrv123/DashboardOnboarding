import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROLES } from "@/constants";
import Authentication from "@/helper/authentication";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
const SupportDesk = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [isVerfied, setVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verified = await Authentication.verify();
        const { data } = verified;
        const { success, existingUserData } = data;
        if (success && existingUserData.role === ROLES.SUPPORT_DESK) {
          const headers = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const response = await axios.get(
            "http://localhost:8000/api/v1/route/show-transaction/display"
          );
          setTransactions(response.data);
          setVerified(true);
        } else if (success && existingUserData.role !== ROLES.SUPPORT_DESK) {
          console.log("Unauthorizsed");
          router.push("/UnAuthorised");
        } else {
          router.push("/Login");
        }
      } catch (e) {
        console.log("Error while fetchData " + e);
      }
    };
    fetchData();
  }, [isVerfied]);

  if (transactions.length === 0) {
    return <div>Loading...</div>;
  }

  const LogOut = async () => {
    Cookies.remove("token");
    setVerified(false);
    const logOut = await axios.get("http://localhost:8000/authenticate/logOut");
  };

  return (
    <div>
      <h1>Support Desk</h1>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <p>ID: {transaction.id}</p>
          <p>Name: {transaction.name}</p>
          <p>Email: {transaction.email}</p>
          <p>Gender: {transaction.gender}</p>
          <p>Role: {transaction.role}</p>
          <p>Wallet: {transaction.wallet}</p>
          <p>All Transaction IDs:</p>
          <ul>
            {transaction.newtid.map((transactionId) => (
              <li key={transactionId}>{transactionId}</li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
      <button onClick={() => LogOut()}>LogOut</button>
    </div>
  );
};

export default SupportDesk;
