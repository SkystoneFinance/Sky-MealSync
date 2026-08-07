import {
Navigate,
Outlet
} from "react-router-dom";

import {
useAuth
} from "../../hooks/useAuth";



export default function ProtectedRoute(){

const {
user,
loading
}=useAuth();



if(loading){

return (

<div className="
h-screen
flex
items-center
justify-center
font-semibold
">

Loading MealSync...

</div>

);

}





if(!user){

return (

<Navigate
to="/login"
replace
/>

);

}



return <Outlet/>;


}