import {
Navigate,
Outlet
} from "react-router-dom";


import {
useAuth
} from "../../hooks/useAuth";


import type {
Role
} from "../../types/auth";



interface Props{

allowedRoles:Role[];

}



export default function RoleRoute({

allowedRoles

}:Props){


const {
user
}=useAuth();



if(!user){

return (

<Navigate
to="/login"
replace
/>

);

}




if(
!allowedRoles.includes(
user.role
)

){

return (

<Navigate
to="/"
replace
/>

);

}



return <Outlet/>;


}