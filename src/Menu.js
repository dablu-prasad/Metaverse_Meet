
import React from 'react';
import { useNavigate } from "react-router-dom";
const Menu=()=>{
const navigate=useNavigate();
    const navOrganize=()=>{navigate('/organize_meet')}
    const navHome=()=>{navigate('/')}
    return(
      <div className='App'>
<div className="d-flex justify-content-center padding-top">
<button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" onClick={navHome}>
  Home
</button>
<button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" onClick={navOrganize}>
  Organize Meet
</button>
</div>
</div>
    )
    
}

export default Menu;