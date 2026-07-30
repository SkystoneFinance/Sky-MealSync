import axios from "../lib/axios";


import type {

AttendanceRecord,

ReportSummary,

DepartmentReport

} from "../types/history";



interface ApiResponse<T>{

success:boolean;

data:T;

message?:string;

}



export const historyService = {



async getAttendanceHistory(){


const response = await axios.get<
ApiResponse<AttendanceRecord[]>
>(

"/attendance/history"

);


return response.data.data;


},





async getWeeklyReport(){


const response =
await axios.get<
ApiResponse<ReportSummary>
>(

"/reports/weekly"

);



return response.data.data;


},





async getMonthlyReport(){


const response =
await axios.get<
ApiResponse<ReportSummary>
>(

"/reports/monthly"

);



return response.data.data;


},





async getDepartmentReport(){


const response =
await axios.get<
ApiResponse<DepartmentReport[]>
>(

"/reports/departments"

);



return response.data.data;


}


};