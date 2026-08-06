import axios from "../lib/axios";


import type {
 Staff,
 CreateStaffPayload
} from "../types/staff";



interface ApiResponse<T>{

 success:boolean;

 data:T;

 message?:string;

}



export const staffService = {



async getAll(){

 const response =
 await axios.get<ApiResponse<Staff[]>>(
   "/staff"
 );


 return response.data.data;

},




async create(
 data:CreateStaffPayload
){

 const response =
 await axios.post<ApiResponse<Staff>>(
   "/staff",
   data
 );


 return response.data.data;

},





async importStaff(
 file:File
){

const formData =
new FormData();


formData.append(
 "file",
 file
);



const response =
await axios.post(

"/staff/import",

formData,

{
headers:{
"Content-Type":
"multipart/form-data"
}
}

);



return response.data;


},





async delete(
id:string
){

 const response =
 await axios.delete<ApiResponse<null>>(
   `/staff/${id}`
 );


 return response.data;

},


};