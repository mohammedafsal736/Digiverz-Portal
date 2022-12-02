import React, { useEffect, useState, Component } from "react";
import axios from "axios";
import './FileUpload.css';

const History =() => {
    const [array, setArray]= useState([]);

    const [column, setColumn] = useState([]);
    const [types,setTypes] = useState(null);
    const [rc, setRc] =useState(null);
    const [desc, setDesc] =useState(null);
    const [dcol, setDcol] =useState([]);
    const [head, setHead] =useState(null);
    const [tail, setTail] = useState(null);
    const [nulls, setNulls] = useState(null);

    const rowClick =(data)=> {
        console.log(data);
        console.log("clicked");
        setRc(data.rc);
        setColumn(data.column);
        setTypes(data.types);
        setDesc(data.desc);
        setDcol(data.dcol);
        setHead(data.head);
        setNulls(data.nulls);
        setTail(data.tail);
    }

    useEffect(()=>{
        axios({
            method: "get",
            url:"http://localhost:5000/api/dq-history",
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then((response) => {
            // let path = `home`; 
            console.log(response.data.data)
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
                <div class="caption2">Data Quality History</div>  
                <table className="table2">
                    <thead className="topics2">
                        <tr>
                            <td>File Name</td>
                            <td>Uploaded Date</td>
                        </tr>
                    </thead>
                    <tbody >
                        { array.map(data =>
                        data.user===localStorage.getItem('name')?
                        <tr onClick={() => rowClick(data) } key={data.Date}>
                            <td >{data.Dataset}</td>
                            <td>{data.Date}</td>
                        </tr>
                        :null
                        )}
                    </tbody>
                </table>
                </div>
            }
            {
                !array && 
                <div> There is no History of datasets</div>
            }

            {
            rc && 
            <div>
            <div class="fcaption">
            <div>Rows : {rc[0]}</div>
            <div>Columns : {rc[1]}</div>
            </div>
            </div>
            } 

            {
            types && 
            <div>
            <div class="caption2">DATA TYPES</div>  
            <table className="table2">
                <thead className="topics2">
                <th >COLUMN NAME</th>
                <th >DATA TYPE</th>
                </thead>
                <tbody>
                {types.map((val,index)=> <tr key={index}>
                    <td>{val.name}</td>
                    <td>{val.value}</td>
                </tr>)}
                </tbody>
            </table>
            </div>
            }

            {
            nulls && 
            <div>
            <div class="caption2">NUMBER OF NULL VALUES</div>  
            <table className="table2">
                <thead className="topics2">
                <th>COLUMN NAME</th>
                <th>SUM OF NULL</th>
                </thead>
                <tbody>
                {nulls.map((val,index)=> <tr key={index}>
                    <td>{val.name}</td>
                    <td>{val.value}</td>
                </tr>)}
                </tbody>
            </table>
            </div>
            }

            {
            desc &&
            <div>
            <div class="caption2">DESCRIPTION</div>  
            <table className="table2">
                <thead className="topics2">
                <tr>
                    {dcol.map(head => <th key={head}>{head}</th>)}
                </tr>
                </thead>
                <tbody>
                {desc.map(row => <TableRow key={row} row={row}/>)}
                </tbody>
            </table>
            </div>
            }

            {
            head && 
            <div>
            <div class="caption2">HEAD OF THE TABLE</div>  
                <table className="table2">
                    <thead className="topics2">
                        <tr>
                        {column.map(head => <th key={head}>{head}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                    {head.map(row => <TableRow key={row} row={row} />)}
                    </tbody>
                </table>
            </div>
            } 

            {
            tail && 
            <div>
            <div class="caption2">TAIL OF THE TABLE</div>  
                <table className="table2">
                <thead className="topics2">
                        <tr>
                        {column.map(head => <th key={head}>{head}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                    {tail.map(row => <TableRow key={row} row={row} />)}
                    </tbody>
                </table>
                </div>
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

export default History;