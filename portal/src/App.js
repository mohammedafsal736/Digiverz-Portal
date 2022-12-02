import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './Components/Signin';
import Register from './Components/Register';
import Home from './Components/Home';
import DQhome from './Components/DataQuality/DQhome';
import History from './Components/DataQuality/History';
import MBHome from './Components/ModelBuilder/MBHome';
import MBHistory from './Components/ModelBuilder/MBHistory';
import AlHome from './Components/AlgorithmAnalyzer/AlHome';
import SalesHome from './Components/SalesForecasting/SalesHome';
import AlHistory from './Components/AlgorithmAnalyzer/AlHistory';
import SalesHistory from './Components/SalesForecasting/SalesHistory';
import Profile from './Components/Profile';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signin/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/DataQuality" element={<DQhome/>}></Route>
        <Route path="/DQHistory" element={<History/>}></Route>
        <Route path="/ModelBuilder" element={<MBHome/>}></Route>
        <Route path="/MBHistory" element={<MBHistory/>}></Route>
        <Route path="/Alhome" element={<AlHome/>}></Route>
        <Route path="/AlHistory" element={<AlHistory/>}></Route>
        <Route path="/Saleshome" element={<SalesHome/>}></Route>
        <Route path="/SalesHistory" element={<SalesHistory/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="*" element={<Signin/>}></Route>
      </Routes> 
    </div>
  );
}

export default App;
