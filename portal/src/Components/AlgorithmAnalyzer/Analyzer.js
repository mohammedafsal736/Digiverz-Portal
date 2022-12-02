import React,{useState} from "react";
import { Component } from 'react';
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload} from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Analyzer = () => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [value,setValue]= useState(null);
    const [fname,setFname]= useState(null);
    const [saved,setSaved]=useState(false);
    const [user,setUser]=useState(null);

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
        console.log("save")
        if(value){
            axios({
                method: "post",
                url:"http://localhost:5000/api/save-algo",
                headers:{
                  'Content-Type': 'application/json' 
                },
                data:{
                    fname:fname,
                    user:user,
                    value:value
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


      const handleUpload = () => {
        toast.info('Data is being analyzed!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('file', file);
        });
        setUploading(true); 
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    
        axios({
          method: "post",
          url:"http://localhost:5000/api/algo_analyze",
          config,
          data:formData
        })
        
        .then((response) => {
          toast.success('Data is Analyzed!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          console.log(response);
          setUser(localStorage.getItem('name'))
          setFileList([]);
          setValue(response.data.status.jsonvalue)
          setFname(response.data.status.fname)
          console.log(response.data.status.jsonvalue)
          }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        }) 
        
      };
    return(
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
                      {value.map(row => <TableRow key={row} row={row} />)}
                    </tbody>
                </table>
                <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" onClick={SaveClick} >SAVE</button>
                <ToastContainer />
                </div>
            } 

            {saved &&
            <div>Predicted Data is stored is the Database</div>}
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

export default Analyzer;