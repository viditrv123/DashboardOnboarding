import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { ROLES } from "@/constants";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const reqBody = {
        email,
        password,
      };
      console.log(reqBody);
      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        "http://localhost:8000/api/v1/route/Login",
        reqBody,
        headers
      );
      console.log(data);
      const {
        data: { success, user, token },
      } = data;
      if (success) {
        console.log(user[0].role);
        Cookies.set("token", token, {
          expires: 1,
          secure: false,
        });
        switch (user[0].role) {
          case ROLES.SUPER_ADMIN: {
            router.push("/SuperAdmin");
            break;
          }
          case ROLES.ADMIN: {
            router.push("/Admin");
            break;
          }
          case ROLES.USER: {
            router.push("/User");
            break;
          }
          case ROLES.POWER_USER: {
            router.push("/PowerUser");
            break;
          }
          case ROLES.SUPPORT_DESK: {
            router.push("/SupportDesk");
            break;
          }
          default: {
            console.log("error");
          }
        }
      }
      setEmail("");
      setPassword("");
    } catch (e) {
      console.log("error while enteracting with the db" + e);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Page;
