import React, {useEffect} from 'react';
import axios from 'axios';

const Profile = () => {


    useEffect(()=>{
        axios({
            method: "post",
            url:"http://localhost:5000/api/profile",
            headers: { 'Content-Type': 'application/json' },
            data:{
                name:localStorage.getItem('name')
            }
          })
          .then((response) => {
            console.log(response)
            }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
              }
          }) 
    },[])


    return(
        <div>profile</div>
    )
}

export default Profile;