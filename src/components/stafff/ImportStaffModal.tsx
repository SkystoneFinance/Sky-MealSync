import { useState } from "react";
import { UploadCloud, X, FileSpreadsheet } from "lucide-react";
import toast from "react-hot-toast";

import { useImportStaff } from "../../hooks/useStaff";


interface Props {

  open:boolean;

  close:()=>void;

}



export default function ImportStaffModal({

  open,

  close,

}:Props){


const [file,setFile]=useState<File | null>(null);



const {
 mutate,
 isPending
}=useImportStaff();





if(!open) return null;




function submit(){


 if(!file){

   toast.error(
    "Please select an Excel file"
   );

   return;

 }




 mutate(file,{

  onSuccess(data){

    toast.success(
      `${data.data.imported} staff imported successfully`
    );


    setFile(null);

    close();

  },


  onError(){

    toast.error(
      "Failed to import staff"
    );

  }


 });


}







return (

<div className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
">



<div className="
w-[420px]
rounded-3xl
bg-white
p-6
shadow-xl
">



<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="
text-xl
font-bold
">

Import Staff Excel

</h2>



<button onClick={close}>

<X/>

</button>


</div>






<label

className="
flex
cursor-pointer
flex-col
items-center
justify-center
rounded-2xl
border-2
border-dashed
border-gray-300
p-8
hover:border-[#B10F16]
"

>


{
file ?

(

<div className="text-center">

<FileSpreadsheet
className="mx-auto mb-2 text-green-600"
/>


<p className="
font-medium
">

{file.name}

</p>


</div>

)


:

(

<>

<UploadCloud
size={40}
className="text-[#B10F16]"
/>


<p className="mt-3 text-gray-500">

Choose Excel File

</p>


</>

)

}



<input

type="file"

accept="
.xlsx,.xls
"

hidden


onChange={(e)=>{

const selected =
e.target.files?.[0];


if(selected){

setFile(selected);

}

}}


/>


</label>





<button


disabled={isPending}


onClick={submit}


className="
mt-6
w-full
rounded-xl
bg-[#B10F16]
py-3
font-semibold
text-white
transition
hover:scale-105
disabled:opacity-50
"


>

{

isPending

?

"Importing..."

:

"Upload Staff"

}


</button>



</div>


</div>


)

}