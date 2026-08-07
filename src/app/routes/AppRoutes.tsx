import {
Routes,
Route,
Navigate
} from "react-router-dom";


import AdminLayout 
from "../layout/dashboardLayout";


import ProtectedRoute
from "../../components/auth/protectedRoutes";


import RoleRoute
from "../../components/auth/roleRoutes";



import Login
from "../../components/auth/login";


import Dashboard
from "../../components/dashboard/dashboard";


import CheckMeal
from "../../components/attendance/TodayAttendance";


import History
from "../../components/history/History";


import Staffs
from "../../components/stafff/staff";


import Scan
from "../../components/scan/scan";




export default function AppRoutes(){


return (

<Routes>


{/* PUBLIC */}

<Route

path="/login"

element={<Login/>}

/>





{/* PROTECTED */}

<Route

element={<ProtectedRoute/>}

>


<Route

element={<AdminLayout/>}

>


{/* Everyone logged in */}

<Route

index

element={<Dashboard/>}

/>




<Route

path="check-meal"

element={<CheckMeal/>}

/>




<Route

path="history"

element={<History/>}

/>






{/* ADMIN + SUPER ADMIN */}

<Route

element={

<RoleRoute

allowedRoles={[

"ADMIN",

"SUPER_ADMIN"

]}

/>

}

>


<Route

path="scan"

element={<Scan/>}

/>


</Route>








{/* SUPER ADMIN ONLY */}

<Route

element={

<RoleRoute

allowedRoles={[

"SUPER_ADMIN"

]}

/>

}

>


<Route

path="staff"

element={<Staffs/>}

/>


</Route>



</Route>


</Route>






<Route

path="*"

element={<Navigate to="/" replace/>}

/>



</Routes>

);


}