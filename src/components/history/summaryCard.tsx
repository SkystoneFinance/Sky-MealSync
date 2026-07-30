import {
Users,
Utensils,
Percent
} from "lucide-react";

import type {ReportSummary} from "../../services/report.service";



interface Props{

summary:ReportSummary | undefined;

}



export default function HistorySummary({

summary

}:Props){


if(!summary)

return null;



const cards=[

{

title:"Total Staff",

value:summary.totalStaff,

icon:Users

},

{

title:"Total Meals Served",

value:summary.served,

icon:Utensils

},

{

title:"Attendance Rate",

value:`${summary.attendanceRate}%`,

icon:Percent

}

];



return (

<div className="
grid
md:grid-cols-3
gap-5
">


{
cards.map((card)=>{


const Icon=card.icon;


return (

<div

key={card.title}

className="
rounded-3xl
bg-white
border
shadow-sm
p-6
flex
items-center
gap-4
"

>


<div className="
rounded-2xl
bg-[#B10F16]/10
p-3
">

<Icon
className="text-[#B10F16]"
/>

</div>



<div>

<p className="
text-gray-500
text-sm
">

{card.title}

</p>


<h2 className="
text-3xl
font-bold
">

{card.value}

</h2>


</div>


</div>

)


})

}



</div>

)

}