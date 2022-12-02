import React, {useState, Component} from "react";
import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {  Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Forecast = () => {

    const [type,setType]=useState("");
    const [value,setValue]=useState("");
    const [pred,setPred]=useState([]);
    const [prog,setProg] = useState(null);
    const [con,setCon] = useState(null);
    const [saved,setSaved]=useState(null);
    const [user,setUser]= useState(null);
    const [im,setIm]= useState(null);
    const [im1,setIm1]= useState(null);
    const [im2,setIm2]= useState(null);

    const antIcon = (
        <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
        />
    );


    const handleChange = (event) => {
        setType(event.target.value);
        console.log(event.target.value);
    };  

    const Buttonclick = () => {
        toast.info('Data is being processed!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        setProg(true)
        console.log(type,value);
        axios({
            method: "post",
            url:"http://localhost:5000/api/sales",
            headers: { 'Content-Type': 'application/json' },
            data:{
                type: type, 
                value:value
            }
            })
            .then((response) => {
                setCon(true);
                toast.success('Data is processed!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                console.log(response)
                setUser(localStorage.getItem('name'))
                setPred(response.data.status.pred);
                setIm(response.data.status.data)
                setIm1(response.data.status.data1)
                setIm2(response.data.status.data2)
                setProg(false)
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
                }
            }) 
    }



    const SaveClick = () => {
        console.log("save")
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
        if(value){
            axios({
                method: "post",
                url:"http://localhost:5000/api/save-sales",
                headers:{
                  'Content-Type': 'application/json' 
                },
                data:{
                    type:type,
                    value:value,
                    user:user,
                    pred:pred,
                    graph1:im,
                    graph2:im1,
                    graph3:im2,
                }
              })
              .then((response) => {
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
    <p className="topic">SALES FORECASTING</p>
    <table>
        <tbody>
            <tr>
            <td class="label">Preferred Type</td>
            <td>
                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                <InputLabel id="demo-select-small">Type</InputLabel>
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
                    <MenuItem value={"D"}>Day</MenuItem>
                    <MenuItem value={"M"}>Month</MenuItem>
                    <MenuItem value={"Y"}>Year</MenuItem>
                </Select>
                </FormControl>
            </td>
            </tr>
            <tr>
                <td class="label">Select the Value</td>
                <td>
                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" onChange={event => setValue(event.target.value)} placeholder="Value" name="value" />
                </td>
            </tr>
        </tbody>
    </table>
    <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={Buttonclick} >PREDICT</button>
    <ToastContainer />
    </div>
    </div>

    {prog? <Spin className='pa5' indicator={antIcon} /> :
    (  
        <div>
        {
            con && 
            <div>
                <div class="caption2">PREDICTED RESULTS</div>  
                <table className="table2">
                    <thead className="topics2">
                        <th>DATES</th>
                        <th>PREDICTED VALUE</th>
                    </thead>
                    <tbody>
                        {pred.map(row => <TableRow key={row} row={row}/>)}
                    </tbody>
                </table>
                <img src={'data:image/png;base64,'+im}/>
                <img src={'data:image/png;base64,'+im1}/>   
                <img src={'data:image/png;base64,'+im2}/>  
                <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={SaveClick} >SAVE</button>
                <ToastContainer />
            </div>
        }
        </div>
    )
    }

    </div>
 )
}


class TableRow extends Component {
    render() {
        var row = this.props.row;
        return (
            <tr>
                {row.map(val => <td key={val}>{val}</td>)}
            </tr>
        )
    }
  }

export default Forecast;