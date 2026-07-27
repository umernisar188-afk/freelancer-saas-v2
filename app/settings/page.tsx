"use client";

import { useState, useEffect } from "react";
import { saveCompany, getCompany } from "../lib/companyStore";
import { supabase } from "../lib/supabase";

export default function Settings(){

const [company,setCompany] = useState({
  name:"Freelancer SaaS",
  email:"",
  phone:"",
  logo:""
});


useEffect(()=>{

const savedCompany = getCompany();

setCompany(savedCompany);

},[]);



return (

<main className="min-h-screen bg-green-100 p-10">


<div className="bg-white rounded-3xl p-10 max-w-xl">


<h1 className="text-3xl font-bold text-green-800">
Company Settings
</h1>



<input

className="w-full mt-5 p-3 border rounded-xl text-gray-900"

placeholder="Company Name"

value={company.name}

onChange={(e)=>

setCompany({

...company,

name:e.target.value

})

}

/>



<input

className="w-full mt-3 p-3 border rounded-xl text-gray-900"

placeholder="Email"

value={company.email}

onChange={(e)=>

setCompany({

...company,

email:e.target.value

})

}

/>



<input

className="w-full mt-3 p-3 border rounded-xl text-gray-900"

placeholder="Phone"

value={company.phone}

onChange={(e)=>

setCompany({

...company,

phone:e.target.value

})

}

/>




<input

type="file"

accept="image/*"

className="w-full mt-3 p-3 rounded-xl border text-black"


onChange={(e)=>{


const file = e.target.files?.[0];


if(!file) return;



const reader = new FileReader();



reader.onload = ()=>{


setCompany({

...company,

logo: reader.result as string

});


};



reader.readAsDataURL(file);



}}


/>



{company.logo && (

<img

src={company.logo}

alt="Company Logo"

className="mt-5 w-32 h-32 object-contain rounded-xl border-4 border-black"

/>

)}



<button


className="mt-5 bg-green-600 text-white px-5 py-3 rounded-xl"

onClick={async ()=>{

const { data, error } = await supabase
.from("companies")
.insert([
  {
    name: company.name,
    email: company.email,
    phone: company.phone,
    logo: company.logo
  }
]);

if (error) {
  console.log(error);

  alert(error.message);

  return;
}


console.log(data);
saveCompany(company);
alert("Company saved to database");

}}

>


Save Company


</button>



</div>


</main>

)

}