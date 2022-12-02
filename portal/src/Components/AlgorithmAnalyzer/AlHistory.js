import React, {useEffect, useState, Component} from "react";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const AlHistory = () => {

    const [array,setArray]=useState(null);
    const [value,setValue]= useState(null);

    const rowClick = (row) => {
        console.log(row);
        setValue(row.value);
    }

    useEffect(()=>{
        axios({
            method: "get",
            url:"http://localhost:5000/api/aa-history",
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
                            <TableCell className="topics1" >File Name</TableCell>
                            <TableCell className="topics1" align="center">Time</TableCell>
                            <TableCell className="topics1" align="center">User</TableCell>
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
                            <TableCell  component="th" scope="row">
                                {row.fname}
                            </TableCell>
                            <TableCell align="right">{row.time}</TableCell>
                            <TableCell align="right">{row.user}</TableCell>
                            </TableRow>
                            : null
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </div>
            }

            {
              value && 
              <div>
              <div className="caption2">ALGORITHM ANALYZER</div>  
                <table className="table2">
                  <thead className="topics2">
                      <th >MODEL</th>
                      <th >ACCURACY</th>
                      <th >AUC</th>
                      <th >RECALL</th>
                      <th >PREC.</th>
                      <th >F1</th>
                      <th >KAPPA</th>
                      <th >MCC</th>
                      <th >TT</th>
                    </thead>
                    <tbody>
                      {value.map(row => <Tablerow key={row} row={row} />)}
                    </tbody>
                </table>
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

export default AlHistory;