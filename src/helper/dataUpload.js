import Cookies from "js-cookie";
import axios from "axios";

const upload = async (source, attrs) => {
  switch (source) {
    case "SUPER_ADMIN": {
      const { oldGroups, peopleToUpdate, newGroups } = attrs;
      const reqBody = {
        oldGroups,
        peopleToUpdate,
        newGroups,
      };
      const headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        "http://localhost:8000/api/v1/route/GroupUpdate",
        reqBody,
        headers
      );
      break;
    }
    case "ADMIN": {
      break;
    }
    case "User": {
      break;
    }
    case "POWER_USER": {
      break;
    }
    case "SUPPORT_DESK": {
      break;
    }
  }
  try {
    const token = Cookies.get("token");
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
    }
  } catch (e) {
    console.log("Error while token authentication " + e);
  }
};

const dataUpload = {
  upload,
};

export default dataUpload;
