interface Props{

period:string;

setPeriod:(value:string)=>void;

}


export default function HistoryFilter({

period,

setPeriod

}:Props){



const filters=[

"today",

"weekly",

"monthly"

];



return (

<div className="
flex
gap-3
">


{
filters.map((item)=>(


<button

key={item}

onClick={()=>setPeriod(item)}

className={`
px-5
py-2
rounded-xl
font-medium
capitalize
transition

${
period===item

?

"bg-[#B10F16] text-white"

:

"bg-gray-100 text-gray-700"

}

`}

>


{item}


</button>


))

}



</div>


)

}