import Authentication from "@/helper/authentication";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ResetPasswordPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const getToken =()=>{
        const { token, id } = router.query;
        return { token, id }
    }

    useEffect(() => {
        const getTokenDetails=getToken()
        const {token, id} = getTokenDetails
        console.log(token)
        console.log(id)        
        const fetchData = async () => {
          try {
            if(token){
                const isValid= await axios.post('http://localhost:8000/api/v1/route/reset-password/valid',{token})
                console.log(isValid.data.status)
                if(isValid.data.status==='ACTIVE'){
                    const expireToken= await axios.post('http://localhost:8000/api/v1/route/reset-password/expire',{token})
                }else{
                    router.push('/InvalidLink')
                }
            }
          } catch (e) {
            console.log("Error while fetchData " + e);
          }
        };
        fetchData();
      }, [router]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      } else {
        event.preventDefault();
        const reqBody = {
          email,
          newPassword,
        };
        console.log(reqBody);
        const headers = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const data = await axios.post(
          "http://localhost:8000/api/v1/route/reset-password",
          reqBody,
          headers
        );
        // console.log('Please check');
        console.log(data);
        router.push('/Login')
      }
    } catch (e) {
      console.log("error while enteracting with the db" + e);
    }
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <div>
      <h2>Reset Password</h2>
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
        <label htmlFor="new-password">New Password:</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br />
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        <br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
