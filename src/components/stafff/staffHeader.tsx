import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";



interface Props{

onAdd:()=>void;

}


export default function StaffHeader({
onAdd
}:Props){


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
flex py-5
items-center
justify-between
"

>


<div>

<h1 className="text-2xl md:text-4xl font-bold tracking-tight">
    Staff Management
</h1>


<p className="text-gray-500 mt-2 text-xs md:text-lg">
    Manage staff members and QR attendance
</p>

</div>



<button onClick = {onAdd} className="flex items-center gap-2 rounded-2xl bg-[#991B1B] text-red p-4 text-white font-semibold shadow-lg hover:scale-105 transition">

<UserPlus size={20}/>

Add Staff

</button>


</motion.div>


)

}