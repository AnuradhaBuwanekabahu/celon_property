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

<<<<<<< Updated upstream
           </div>
        
=======
                {filteredHotSales.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                        No properties found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredHotSales.map((item) => (
                            <div key={item.id}>
                                <div
                                    onClick={() => navigate(`/dashboard/hot-sales/profile/${item.id}`, { state: { clientID } })}
                                    className="relative mx-auto h-[320px] w-full max-w-[320px] overflow-hidden rounded-xl shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:h-[340px] sm:max-w-none"
                                >
                                    <img src={item.main_image} alt={item.title} className="h-full w-full object-cover" />
>>>>>>> Stashed changes

        </div>
    )
}

export default ShowHotSales;