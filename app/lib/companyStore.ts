export function saveCompany(data:any){

localStorage.setItem(
"company",
JSON.stringify(data)
);

}



export function getCompany(){

if(typeof window === "undefined"){

return {
name:"",
email:"",
phone:"",
logo:""
};

}


const data = localStorage.getItem("company");


if(!data){

return {
name:"",
email:"",
phone:"",
logo:""
};

}


const company = JSON.parse(data);


return {

name: company.name || "",
email: company.email || "",
phone: company.phone || "",
logo: company.logo || ""

};


}