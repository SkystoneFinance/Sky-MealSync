import DashboardHeader from "./DashboardHeader";
import StatsSection from "./statsSection";

import { useDashboard } from "../../hooks/useDashboard";


export default function Dashboard(){


const {
 data,
 isPending,
 isError

}=useDashboard();



if(isPending){

 return <p>Loading dashboard...</p>;

}



if(isError || !data){

 return (
 <p>
 Unable to load dashboard
 </p>
 );

}



return (

<div className="space-y-7">


<DashboardHeader/>


<StatsSection
 stats={data}
/>


</div>


);


}