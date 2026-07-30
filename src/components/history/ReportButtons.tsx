import {Download} from "lucide-react";


import {
downloadCSV
} from "../../utils/download";



import {
useHistory
} from "../../hooks/useHistory";



export default function ReportButtons(){


const {
weekly,
monthly

}=useHistory();



async function weeklyDownload(){

const data =
await weekly.refetch();


if(data.data){

downloadCSV(
[data.data],
"weekly-attendance.csv"
)

}


}



async function monthlyDownload(){


const data =
await monthly.refetch();


if(data.data){

downloadCSV(
[data.data],
"monthly-attendance.csv"
)

}


}



return (

<div className=" bg-grey-500 p-5 rounded-xl flex gap-4">

<button

onClick={weeklyDownload}

className="
flex
items-center
gap-2
rounded-xl
bg-[#B10F16]
px-5
py-3
text-white
font-semibold
hover:scale-105
transition
"

>

<Download size={18}/>

Weekly Report

</button>




<button

onClick={monthlyDownload}

className="
flex
items-center
gap-2
rounded-xl
bg-black
px-5
py-3
text-white
font-semibold
hover:scale-105
transition
"

>

<Download size={18}/>

Monthly Report

</button>



</div>

)

}