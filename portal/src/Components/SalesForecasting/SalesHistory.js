import React, {useEffect, useState, Component} from "react";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SalesHistory = () => {

    const [array,setArray]=useState(null);
    const [con,setCon]= useState(false);
    const [type,setType]=useState(null);
    const [value,setValue]=useState(null);
    const [pred,setPred]=useState([]);
    const [im,setIm]= useState(null);
    const [im1,setIm1]= useState(null);
    const [im2,setIm2]= useState(null);

    const rowClick = (data) => {
        console.log(data);
        setCon(true);
        setType(data.type);
        setValue(data.value);
        setPred(data.pred);
        setIm(data.graph1);
        setIm1(data.graph2);
        setIm2(data.graph3);
    }

    useEffect(()=>{
        axios({
            method: "get",
            url:"http://localhost:5000/api/sf-history",
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response) => {

            console.log(response)
            setArray(response.data.data)
            }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
              }
          }) 
    },[])


    return(
        <div>
            {
                array && 
                <div>
                    <h1 class="caption1">PREDICTED HISTORY</h1>
                    <TableContainer component={Paper}>
                    <Table className="table" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow className="topics">
                            <TableCell className="topics1" >Product Type</TableCell>
                            <TableCell className="topics1" align="center">Quantity</TableCell>
                            <TableCell className="topics1" align="right">Gross Sales</TableCell>
                            <TableCell className="topics1" align="right">Discount</TableCell>
                            <TableCell className="topics1" align="right">Return</TableCell>
                            <TableCell className="topics1" align="right">Total Net Sales</TableCell>
                            <TableCell className="topics1" align="right">Algorithm</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {array.map((row) => (
                            row.user===localStorage.getItem('name')?
                            <TableRow
                            key={row.tns}
                            onClick={() => rowClick(row)}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.type}
                            </TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                            <TableCell align="right">{row.user}</TableCell>
                            <TableCell align="right">{row.time}</TableCell>
                            <TableCell align="right">{row.rtrn}</TableCell>
                            <TableCell align="right">{row.tns}</TableCell>
                            <TableCell align="right">{row.algo}</TableCell>
                            </TableRow>
                            : null
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </div>
            }

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
                            {pred.map(row => <Tablerow key={row} row={row}/>)}
                        </tbody>
                    </table>
                    <img src={'data:image/png;base64,'+im}/>
                    <img src={'data:image/png;base64,'+im1}/>   
                    <img src={'data:image/png;base64,'+im2}/>  
                </div>
            }
        </div>
    )
}

class Tablerow extends Component {
    render() {
        var row = this.props.row;
        return (
            <tr>
                {row.map(val => <td key={val}>{val}</td>)}
            </tr>
        )
    }
  }

export default SalesHistory;