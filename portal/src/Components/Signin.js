import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

const Signin = ()=> {

    const [email,setEmail] = useState("");
    let signin=false;
    const [pass,setPass]=useState("");
    let navigate = useNavigate();

    const onEmailChange = (event)=>{
        setEmail(event.target.value);
 
    }

    const onPasswordChange = (event)=>{
        setPass(event.target.value);
    }

    const onSubmitSignin = () =>{
        if(email && pass){
            axios({
                method: "post",
                url:"http://localhost:5000/api/handle-signin",
                data:{
                    email: email,
                    password: pass
                }
              })
              .then((response) => {
                console.log(response)
                if(response.data.status.statusCode === "200"){
                  localStorage.setItem('token',response.data.status.access_token)
                  localStorage.setItem('name',response.data.status.name)
                  navigate('/home');
                }
                else{
                  alert("Incorrect Email or Password");
                }
                }).catch((error) => {
                if (error.response) {
                  console.log(error.response)
                  console.log(error.response.status)
                  console.log(error.response.headers)
                  }
              }) 
        }
        else{
            alert("Empty Email or Password");
        }
    }

    return(
        <div>
            <Navigation isSignedIn={signin}></Navigation>
            <div className="pt5">
            <article className="br2 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
					  <legend className="f1 fw6 ph0 mh0">Sign In</legend>
					  <div className="mt3">
						<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
						<input onChange={onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
					  </div>
					  <div className="mv3">
						<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
						<input onChange={onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
					  </div>
					</fieldset>
					<div className="">
					  <input onClick={onSubmitSignin}  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
					</div>
					<div className="lh-copy mt3">
					  <Link to="/register" className="f6 link dim black db pointer">Register</Link>
					</div>
				  </div>
				</main>
			</article>
            </div>
        </div>
    )
}

export default Signin;
