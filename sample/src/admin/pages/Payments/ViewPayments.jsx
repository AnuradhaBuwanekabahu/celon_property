import React,{useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {ArrowLeft} from "lucide-react";

import {
getPaymentById
} from "../../api/paymentApi";
import Loader from "../../components/Loader";


const ViewPayment=()=>{


const {id}=useParams();

const navigate=useNavigate();


const [payment,setPayment]=useState(null);



useEffect(()=>{


getPaymentById(id)
.then(res=>{

setPayment(
res.data.payment
)

});


},[id]);



if(!payment){

return <Loader />

}

  

return(


<div className="space-y-6">


<button

onClick={()=>navigate(-1)}

className="
bg-gray-600
text-white
px-4 py-2 rounded
"

>

<ArrowLeft size={18}/>

Back

</button>




<div className="bg-white shadow rounded-xl p-6">


<h1 className="text-2xl font-bold mb-5">

Payment Details

</h1>



<p>
Payment ID :
{payment.id}
</p>


<p>
Client ID :
{payment.client_id}
</p>


<p>
Property Type :
{payment.property_type}
</p>


<p>
Property ID :
{payment.property_id}
</p>


<p>
Amount :
Rs.{payment.amount}
</p>


<p>
Payment Method :
{payment.payment_method || "-"}
</p>


<p>
Transaction :
{payment.transaction_ref || "-"}
</p>


<p>
Status :
{payment.status}
</p>



</div>


</div>


)

}


export default ViewPayment;