import React, { useState } from "react";
import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './DataInput.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataInput = () =>{

    const [type,setType]=useState("");
    const [quantity,setQuantity]=useState("");
    const [gsales,setGsales]=useState("");
    const [discount,setDiscount]=useState("");
    const [rtrn,setRtrn]=useState("");
    const [tns,setTns]=useState("");
    const [saved,setSaved]=useState(false);
    const [product,setProduct]=useState("");
    const [algo,setAlgo]=useState("");
    const [user,setUser]=useState(null);
    let but;

    const handleChange = (event) => {
        setType(event.target.value.toString());
    };
 
    const Buttonclick = () => {
        toast.success('Data is processed in KNN!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        but=1;
        console.log(type,quantity,gsales,discount,rtrn);
        setAlgo("K Nearest Neighbour");
        console.log(typeof(parseInt(type)))
        axios({
            method: "post",
            url:"http://localhost:5000/api/predict",
            headers: { 'Content-Type': 'application/json' },
            data:{
                button:but,
                type: type, 
                quantity:quantity,
                gsales:gsales,
                discount:discount,
                rtrn:rtrn
            }
            })
            .then((response) => {
                console.log(response)
                setTns(response.data.status.value)
                setUser(localStorage.getItem('name'))
                settingType(type)
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
                }
            }) 
    }
    const Buttonclick1 = () => {
        toast.success('Data is processed in RF!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        but=2;
        console.log(type,quantity,gsales,discount,rtrn);
        setAlgo("Random Forest");
        console.log(typeof(parseInt(type)))
        axios({
            method: "post",
            url:"http://localhost:5000/api/predict",
            headers: { 'Content-Type': 'application/json' },
            data:{
                button:but,
                type: type, 
                quantity:quantity,
                gsales:gsales,
                discount:discount,
                rtrn:rtrn
            }
            })
            .then((response) => {
                console.log(response)
                setTns(response.data.status.value)
                setUser(localStorage.getItem('name'));
                settingType(type)
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
                }
            }) 
    }

    const settingType= (x) =>{
        switch(x){
            case "0": setProduct("Accessories"); break;
            case "1": setProduct("Art & Sculpture"); break;
            case "2": setProduct("Basket"); break;
            case "3": setProduct("Christmas"); break;
            case "4": setProduct("Easter"); break;
            case "5": setProduct("Fair Trade Gifts"); break;
            case "6": setProduct("Furniture"); break;
            case "7": setProduct("Gift Baskets"); break;
            case "8": setProduct("Home Decor"); break;
            case "9": setProduct("Jewelry"); break;
            case "10": setProduct("Kids"); break;
            case "11": setProduct("Kitchen"); break;
            case "12": setProduct("Music"); break;
            case "13": setProduct("One-of-a-Kind"); break;
            case "14": setProduct("Recycled Art"); break;
            case "15": setProduct("Skin Care"); break;
            case "16": setProduct("Soapstone"); break;
            case "17": setProduct("Textiles"); break;
            default:
        }
        console.log(typeof(x),x)
    }


    const SaveClick = () => {
        toast.success('Data is saved in Database!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        console.log("save")
        if(tns){
            axios({
                method: "post",
                url:"http://localhost:5000/api/save-model",
                headers:{
                  'Content-Type': 'application/json' 
                },
                data:{
                    algorithm:algo,
                    product_type: product,
                    quantity:quantity,
                    gross_sales:gsales,
                    discount:discount,
                    return:rtrn,
                    total_net_sales:tns,
                    user:user
                }
              })
              .then((response) => {
                    console.log(product)
                    console.log(response)
                    console.log(response.data.status.statusCode)
                    if(response.data.status.statusCode === "200"){
                        setSaved(true)
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
            alert("Please complete the prediction process")
        }
        
    }



    return(
        <div>
            <div class="whole">
            <div class="container">
            <p className="topic">Model Prediction</p>
                <table>
                    <tbody>
                        <tr>
                            <td class="label">Product Type</td>
                            <td>
                            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                            <InputLabel id="demo-select-small"> Product Type</InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={type}
                                label="Type"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>Art & Sculpture</MenuItem>
                                <MenuItem value={2}>Basket</MenuItem>
                                <MenuItem value={3}>Christmas</MenuItem>
                                <MenuItem value={8}>Home Decor</MenuItem>
                                <MenuItem value={14}>Recycled Art</MenuItem>
                                <MenuItem value={9}>Jewelry</MenuItem>
                                <MenuItem value={15}>Skin Care</MenuItem>
                                <MenuItem value={11}>Kitchen</MenuItem>
                                <MenuItem value={17}>Textiles</MenuItem>
                                <MenuItem value={0}>Accessories</MenuItem>
                                <MenuItem value={5}>Fair Trade Gifts</MenuItem>
                                <MenuItem value={13}>One-of-a-Kind</MenuItem>
                                <MenuItem value={16}>Soapstone</MenuItem>
                                <MenuItem value={12}>Music</MenuItem>
                                <MenuItem value={6}>Furniture</MenuItem>
                                <MenuItem value={10}>Kids</MenuItem>
                                <MenuItem value={4}>Easter</MenuItem>
                                <MenuItem value={7}>Gift Baskets</MenuItem>
                            </Select>
                            </FormControl>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Net Quantity</td>
                            <td className="pad">
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" onChange={event => setQuantity(event.target.value)} placeholder="Net Quantity" type="number"  name="quantity" />
                            </td>
                        </tr>
                        <tr>
                            <td class="label">GROSS Sales</td>
                            <td>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" onChange={event => setGsales(event.target.value)} placeholder="Gross Sales" type="number"  name="sales" />
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Discount</td>
                            <td>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" onChange={event => setDiscount(event.target.value)} placeholder="Discount" type="number"  name="discount" />
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Returns</td>
                            <td>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" onChange={event => setRtrn(event.target.value)} placeholder="Returns" type="number"  name="return" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                

                <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={Buttonclick} >KNN</button>
                <ToastContainer />
                <div class="pad"></div>
                <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={Buttonclick1} >RANDOM FOREST</button>
            </div>
            </div>

            {tns&& 
            <div>
            <div>{tns}</div>
            <button onClick={SaveClick} >Save </button>
            </div>}
            {saved &&
            <div>Predicted Data is stored is the Database</div>}
        </div>
    )
}

export default DataInput;
