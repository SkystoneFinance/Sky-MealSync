export interface AttendanceRecord {

id:string;

mealDate:string;

scannedAt:string;

staff:{
 id:string;
 firstName:string;
 lastName:string;
 staffNumber:string;
 department:string;
}

}



export interface StaffHistory {

staffId:string;

name:string;

department:string;

weeklyCount:number;

monthlyCount:number;

totalCount:number;

lastMeal:string;

}



export interface ReportSummary {

totalStaff:number;

served:number;

remaining:number;

attendanceRate:number;

}