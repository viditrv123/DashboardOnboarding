import Cookies from "js-cookie";
import axios from "axios";

const verify = async () => {
  try {
    const token = Cookies.get("token");
    console.log('token');
    console.log(token);
    if (token) {
      const isVerified = await axios.get(
        "http://localhost:8000/authenticate/verify",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("show something");
      console.log(isVerified);
      return isVerified;
    }else{
        return {data:{success:false, existingUserData:{}}}
    }
  } catch (e) {
    console.log("Error while token authentication " + e);
  }
};

const Authentication = {
  verify,
};

export default Authentication;
