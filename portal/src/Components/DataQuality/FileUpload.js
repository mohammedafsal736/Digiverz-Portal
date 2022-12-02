import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload} from 'antd';
// import Backdrop from '@mui/material/Backdrop';
//import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Component } from 'react';
import './FileUpload.css';
import {  Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FileUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [column, setColumn] = useState([]);
  const [types,setTypes] = useState(null);
  const [rc, setRc] =useState(null);
  const [desc, setDesc] =useState(null);
  const [dcol, setDcol] =useState([]);
  const [head, setHead] =useState(null);
  const [tail, setTail] = useState(null);
  const [nulls, setNulls] = useState(null);
  const [open, setOpen] = useState(false);
  const [fname,setFname] =useState("");
  const [prog,setProg] = useState(null);
  const [user,setUser]= useState(null);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );


  

  const handleUpload = () => {
    toast.warn('Data is being processed!. May take some time..', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    setProg(true);
    setOpen(!open);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    setUploading(true); 
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    axios({
      method: "post",
      url:"http://localhost:5000/api/file_upload",
      config,
      data:formData
    })
    
    .then((response) => {
      toast.success('Data is processed!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      setProg(false);
      setOpen(false);
      console.log(response);
      setFileList([]);
      setUser(localStorage.getItem('name'));
      setRc(response.data.out.rc);
      setColumn(response.data.status.col);
      setTypes(response.data.out.types);
      setDesc(response.data.out.desc);
      setDcol(response.data.out.desccol);
      setHead(response.data.out.head);
      setNulls(response.data.out.nullsum);
      setTail(response.data.out.tail);
      setFname(response.data.out.fname);
      }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    }) 
    
  };

  const SaveClick = () => {
    toast.success('Data is stored in Database!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    axios({
      method: "post",
      url:"http://localhost:5000/api/save-data",
      headers:{
        'Content-Type': 'application/json' 
      },
      data:{
          fname:fname,
          user:user,
          rc:rc,
          column:column,
          types:types,
          desc:desc,
          dcol:dcol,
          head:head,
          nulls:nulls,
          tail:tail
      }
    })
    .then((response) => {
          console.log(response)
          console.log(response.data.status.statusCode)
          // if(response.data.status.statusCode === "200"){
          //     setSaved(true)
          // }
      }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }



  

  const props = {
    name:'file',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  return (
    <div>
      <h1>Upload your file down below</h1>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? 'Uploaded' : 'Start Upload'}
      </Button>
      <ToastContainer />

      {prog? 
      <Spin className='pa5' indicator={antIcon} /> 
      :
      
      ( <div>

          
        {
          rc && 
          <div>
          <ToastContainer />
          <div class="fcaption">
          <div>{fname}</div>
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
            <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={SaveClick} >SAVE</button>
            <ToastContainer />
            </div>
        } 
      </div>
      )
      }

    </div>
  );
};

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

export default FileUpload;






