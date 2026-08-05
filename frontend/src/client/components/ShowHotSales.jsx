import react, { useContext, useEffect } from 'react'
import {clientContext} from '../context/ClientContext'
import CardDesign from './CardDesign';


const ShowHotSales = () =>{

    const { hotSales,  loading,  getHotSales} =useContext(clientContext);


    useEffect(()=>{
getHotSales();

    },[])


    if(loading){

        return <h2>Loading...</h2>

    }
    return(
        <div>
           <div className='grid grid-cols-3 gap-5'>

            {hotSales.map((item,index) =>(
                <div>
                    <CardDesign title={item.title} 
                                main_image ={item.main_image}
                                property_type={item.property_type}
                                location={item.location}
                                price={item.price}
                                rate={item.rate}
                                duration={item.duration}/>
                </div>
            ))}

           </div>
        

        </div>
    )
}

export default ShowHotSales;