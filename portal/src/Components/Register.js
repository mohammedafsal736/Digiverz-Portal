import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import Navigation from "./Navigation";
import axios from 'axios';

const Register =() =>{
    
    let signin=false;
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [pass,setPass]=useState("");
    let navigate = useNavigate();

    const onNameChange =(event)=>{
        setName(event.target.value);
    }
    const onEmailChange =(event)=>{
        setEmail(event.target.value);
    }
    const onPasswordChange =(event)=>{
        setPass(event.target.value);
    }

    const onSubmitSubmit =()=>{
        axios({
            method: "post",
            url:"http://localhost:5000/api/register-user",
            headers:{
              'Content-Type': 'application/json' 
            },
            data:{
                name: name,
                email: email,
                password: pass
            }
          })
          .then((response) => {
            // let path = `home`; 
            navigate('/home');
            }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
              }
          })  
        // if(name&&email&&pass){
        //     localStorage.setItem('name', name);
        //     localStorage.setItem('email', email);
        //     localStorage.setItem('password', email);
        //     console.log(name,email,pass); 
        //     navigate('/home');
        // }
        // else{
        //     alert("Incomplete Credentials")
        // }
    }

    return(
        <div>
            <Navigation isSignedIn={signin}></Navigation>
            <div className="pt5">
            <article className="br2 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
					  <legend className="f1 fw6 ph0 mh0">Register</legend>
						<div className="mt3">
						<label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
						<input onChange={onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" />
					  </div>
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
					  <input onClick={onSubmitSubmit} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
					</div>
				  </div>
				</main>
			</article>
            </div>
        </div>
    )
}

export default Register;