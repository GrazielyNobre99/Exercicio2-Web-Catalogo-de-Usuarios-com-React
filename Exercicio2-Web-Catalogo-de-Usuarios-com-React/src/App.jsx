import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import UserDetails from './pages/UserDetails';
import './App.css'

function App() {

  return (
    <>
      <div className="App">
        <Header/>

        <main classname="container">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/sobre" element={<Sobre/>}/>
            <Route path="/usuario/:id" element={<UserDetails/>}/>
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;
