import {
 Users,
 UtensilsCrossed,
 UserCheck
} from "lucide-react";


import StatsCard from "./statCard";


import type {
 DashboardStats
} from "../../types/dashboard";


interface Props {

stats:DashboardStats;

}



export default function StatsSection({

stats

}:Props){


return (

<section

className="
rounded-3xl
bg-[#B10F16]
p-5
shadow-[0_12px_30px_rgba(0,0,0,0.18)]
"

>


<div className="grid gap-5 lg:grid-cols-3">


<StatsCard

title="Total Staff"

value={stats.totalStaff}

Icon={Users}

/>



<StatsCard

title="Meals Served Today"

value={stats.mealsServedToday}

Icon={UtensilsCrossed}

/>



<StatsCard

title="Remaining Staff"

value={stats.remainingStaff}

Icon={UserCheck}

/>



</div>


</section>


)

}