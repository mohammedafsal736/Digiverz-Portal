import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './MBHistory.css'

const MBHistory =() =>{
    const [array,setArray]=useState([]);

    const rowClick = (data) => {
        console.log(data)
    }


    useEffect(()=>{
        axios({
            method: "get",
            url:"http://localhost:5000/api/mb-history",
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
        <div class="body">
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
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.gsales}</TableCell>
                            <TableCell align="right">{row.discount}</TableCell>
                            <TableCell align="right">{row.rtrn}</TableCell>
                            <TableCell align="right">{row.tns}</TableCell>
                            <TableCell align="right">{row.algo}</TableCell>
                            </TableRow>
                            :null
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </div>
            }
        </div>
        )
}


export default MBHistory;


