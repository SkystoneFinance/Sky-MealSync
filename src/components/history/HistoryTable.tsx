import type { Attendance } from "../../types/attendance";


interface Props{

attendance:Attendance[];

}



export default function HistoryTable({

attendance

}:Props){



return (

<div className="
rounded-3xl
border
bg-white
shadow-sm
overflow-hidden
">


<div className="overflow-x-auto">


<table className="
w-full
">


<thead className="
bg-gray-50
">


<tr className="
border-b
text-left
text-sm
text-gray-600
">


<th className="px-6 py-4">
Staff
</th>


<th className="px-6 py-4">
Staff Number
</th>


<th className="px-6 py-4">
Department
</th>


<th className="px-6 py-4">
Date
</th>


<th className="px-6 py-4">
Time
</th>


</tr>


</thead>



<tbody>


{
attendance.length === 0 ?

<tr>

<td
colSpan={5}
className="
text-center
py-10
text-gray-500
"
>

No attendance records found

</td>

</tr>


:

attendance.map((record)=>(



<tr

key={record.id}

className="
border-b
hover:bg-gray-50
"


>


<td className="
px-6
py-5
font-semibold
">


{record.staff.firstName}

{" "}

{record.staff.lastName}


</td>



<td className="px-6">

{record.staff.staffNumber}

</td>



<td className="px-6">

{record.staff.department}

</td>




<td className="px-6">


{
new Date(record.mealDate)
.toLocaleDateString()
}


</td>




<td className="px-6">


{
new Date(record.scannedAt)
.toLocaleTimeString()
}


</td>




</tr>


))


}



</tbody>



</table>


</div>



</div>


)

}