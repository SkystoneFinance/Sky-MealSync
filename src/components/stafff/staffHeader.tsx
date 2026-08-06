import {
UserPlus,
ChevronDown,
Upload,
Plus
} from "lucide-react";


import {
motion
} from "framer-motion";


import {
useState
} from "react";



interface Props{

onCreate:()=>void;

onImport:()=>void;

}



export default function StaffHeader({

onCreate,

onImport

}:Props){


const [open,setOpen]=useState(false);



return (


<motion.div

initial={{
opacity:0,
y:15
}}

animate={{
opacity:1,
y:0
}}

className="
flex
items-center
justify-between
"

>


<div>


<h1 className="
text-4xl
font-bold
">

Staff Management

</h1>


<p className="
text-gray-500
mt-2
">

Manage staff members and QR attendance

</p>


</div>





<div className="relative">


<button

onClick={()=>setOpen(!open)}

className="
flex
items-center
gap-2
rounded-2xl
bg-[#B10F16]
px-5
py-3
text-white
font-semibold
shadow-lg
hover:scale-105
transition
"

>


<UserPlus size={20}/>

Add Staff


<ChevronDown size={18}/>


</button>





{
open &&

<div

className="
absolute
right-0
mt-3
w-52
rounded-2xl
bg-white
shadow-xl
border
p-2
z-50
"

>



<button

onClick={()=>{

setOpen(false);

onCreate();

}}

className="
flex
w-full
items-center
gap-3
rounded-xl
px-4
py-3
hover:bg-gray-100
"

>

<Plus size={18}/>

Create Staff

</button>





<button

onClick={()=>{

setOpen(false);

onImport();

}}

className="
flex
w-full
items-center
gap-3
rounded-xl
px-4
py-3
hover:bg-gray-100
"

>

<Upload size={18}/>

Import Excel

</button>



</div>

}



</div>
</motion.div>
)

}