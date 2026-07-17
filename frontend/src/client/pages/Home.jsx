import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home =() =>{

     const navigate =useNavigate();

    return(

        <div>

            <button className='py-2 px-4 border boder-black' onClick={()=>navigate('/client-login')}>
                Login
            </button>
        </div>
    )
}

export default Home ; 
