import { ROLES } from "@/constants";
import Authentication from "@/helper/authentication";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const PowerUser = () => {
  const router = useRouter();
  const [isVerified, setVerified] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verified = await Authentication.verify();
        const { data } = verified;
        const { success, existingUserData } = data;
        if (success && existingUserData.role === ROLES.POWER_USER) {
          const headers = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const allUserData = await axios.get(
            "http://localhost:8000/api/v1/route/getAllUsers"
          );
          console.log("allUserData");
          console.log(allUserData.data);
          setUsers(allUserData.data);
          setVerified(true);
        } else if (success && existingUserData.role !== ROLES.SUPER_ADMIN) {
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
  }, [isVerified]);

  const LogOut = async () => {
    Cookies.remove("token");
    setVerified(false);
    const logOut = await axios.get("http://localhost:8000/authenticate/logOut");
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <br />
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Gender: {user.gender}</p>
            <p>Role: {user.role}</p>
            <br />
            <hr />
          </li>
        ))}
      </ul>
      <button onClick={() => LogOut()}>LogOut</button>
    </div>
  );
};

export default PowerUser;
