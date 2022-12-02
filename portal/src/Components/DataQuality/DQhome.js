import React ,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import History from "./History";
import Navigation from "../Navigation";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';


const DQhome = () => {
    let signin=true;
    let navigate=useNavigate();

    useEffect(() =>{
        if(!localStorage.getItem('token')){
            navigate('/signin');
        }
    })

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return(
        <div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                value={value}
                onChange={handleChange}
                TabIndicatorProps={{
                    sx: {
                      backgroundColor: 'black',
                    },
                  }}
                textColor="inherit"
                variant="fullWidth"
                aria-label="tab"
                >
                    <Tab label="Data Quality" value="1" />
                    <Tab label="History" value="2" />   
                    </Tabs>
                </Box>
                <TabPanel value="1"><FileUpload></FileUpload> </TabPanel>
                <TabPanel value="2"><History /></TabPanel>
            </TabContext>
            </Box>
            {/* <Navigation isSignedIn={signin}></Navigation>
            <FileUpload></FileUpload>  */}
        </div>
    )
}

export default DQhome;