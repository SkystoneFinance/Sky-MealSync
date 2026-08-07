import {
useState
} from "react";

import {
useNavigate
} from "react-router-dom";

import {
useAuth
} from "../../hooks/useAuth";



export default function Login(){


const navigate =
useNavigate();


const {
login
}=useAuth();



const [email,setEmail]
=
useState("");

const [password,setPassword]
=
useState("");

const [error,setError]
=
useState("");




async function submit(
e:React.FormEvent
){

e.preventDefault();


try{


await login({

email,

password

});



navigate("/");


}

catch{

setError(
"Invalid email or password"
);

}


}



return (

<div className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
">


<form

onSubmit={submit}

className="
bg-white
p-8
rounded-3xl
shadow-xl
w-[380px]
space-y-5
"

>


<h1 className="
text-3xl
font-bold
text-center
text-[#B10F16]
">

MealSync

</h1>


<p className="
text-center
text-gray-500
">

Login to continue

</p>




{
error &&

<p className="
text-red-600
text-sm
">

{error}

</p>

}




<input

type="email"

placeholder="Email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

className="
w-full
border
rounded-xl
px-4
py-3
"

/>




<input

type="password"

placeholder="Password"

value={password}

onChange={
e=>setPassword(e.target.value)
}

className="
w-full
border
rounded-xl
px-4
py-3
"

/>



<button

className="
w-full
bg-[#B10F16]
text-white
py-3
rounded-xl
font-semibold
"

>

Login

</button>



</form>


</div>

);


}