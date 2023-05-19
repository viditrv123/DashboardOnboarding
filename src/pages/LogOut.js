import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react"


const LogOut=()=>{

    const LoggingOut=async()=>{
        Cookies.remove("token");
    const logOut = await axios.get(
        "http://localhost:8000/authenticate/logOut"
      );
    }
    useEffect(()=>{
        LoggingOut()
    },[])

    return (<div>LogOut</div>)
        
    
}

export default LogOut