// import axios from "../lib/axios";

// import type {
// AttendanceRecord
// } from "../types/history";


// interface ApiResponse<T>{

// success:boolean;

// data:T;

// }



// export const attendanceService={


// async history(){

// const response =
// await axios.get<
// ApiResponse<AttendanceRecord[]>
// >(
// "/attendance/history"
// );


// return response.data.data;


// },



// async staffHistory(id:string){

// const response =
// await axios.get(
// `/attendance/staff/${id}`
// );


// return response.data.data;


// }

// }