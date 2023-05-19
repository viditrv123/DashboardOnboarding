import { ROLES } from "@/constants";
import Authentication from "@/helper/authentication";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [isVerified, setVerified] = useState(false);
  const [powerUserEmail, setPowerUserEmail] = useState("");
  const [groupDetails, setGroupDetails] = useState({ members: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verified = await Authentication.verify();
        const { data } = verified;
        const { success, existingUserData } = data;
        if (success && existingUserData.role === ROLES.ADMIN) {
          const headers = {
            headers: {
              "Content-Type": "application/json",
            },
          };

          const groupData = existingUserData.groupid
            ? await axios.get(
                `http://localhost:8000/api/v1/route/group/${existingUserData.groupid}`,
                headers
              )
            : { data: { members: [] } };
          console.log("groupData.data");
          console.log(groupData);
          setGroupDetails(groupData.data);
          setVerified(true);
          console.log("Perfect");
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

  const handleUserSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("http://localhost:8000/api/v1/route", {
        email: userEmail,
        role: ROLES.USER,
      });
      console.log("User created:", response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
    console.log("User Email:", userEmail);
  };

  const handlePowerUserSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("http://localhost:8000/api/v1/route", {
        email: powerUserEmail,
        role: ROLES.POWER_USER,
      });
      console.log("Power user created:", response.data);
    } catch (error) {
      console.error("Error creating power user:", error);
    }
    console.log("Power User Email:", powerUserEmail);
  };
  const LogOut = async () => {
    Cookies.remove("token");
    setVerified(false);
    const logOut = await axios.get("http://localhost:8000/authenticate/logOut");
  };

  return (
    <div>
      <form onSubmit={handleUserSubmit}>
        <label>
          User Email:
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create User</button>
      </form>

      <form onSubmit={handlePowerUserSubmit}>
        <label>
          Power User Email:
          <input
            type="email"
            value={powerUserEmail}
            onChange={(e) => setPowerUserEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Power User</button>
      </form>
      {groupDetails.id ? (
        <div key={groupDetails.id}>
          <h2>Group Details</h2>
          <p>ID: {groupDetails.length > 0 && groupDetails.id}</p>
          <p>Group Name: {groupDetails.length > 0 && groupDetails.groupname}</p>
          <h3>Members:</h3>
          {console.log(!!groupDetails.id)}
          <ul>
            {groupDetails.members.map((member) => (
              <div>
                <li key={member.id}>
                  <p>Name: {member.name}</p>
                  <p>Role: {member.role}</p>
                  <p>Email: {member.email}</p>
                  <p>Gender: {member.gender}</p>
                </li>
                <hr />
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
      <button onClick={() => LogOut()}>LogOut</button>
    </div>
  );
};

export default AdminPage;
