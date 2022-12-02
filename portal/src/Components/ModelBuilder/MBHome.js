import React , {useState} from "react";
import DataInput from "./DataInput";
import MBHistory from "./MBHistory";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tabs from '@mui/material/Tabs';

const MBHome = () =>{

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
                    <Tab label="Model Builder" value="1" />
                    <Tab label="History" value="2" />   
                    </Tabs>
                </Box>
                <TabPanel value="1"><DataInput/> </TabPanel>
                <TabPanel value="2"><MBHistory /></TabPanel>
            </TabContext>
            </Box>
        </div>
    )
}

export default MBHome;

