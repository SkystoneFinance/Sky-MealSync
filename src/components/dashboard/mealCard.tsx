// import { motion } from "framer-motion";
// import type { Meal } from "../../types/dashboard";

// interface MealCardProps {
//   meal: Meal;
// }

// export default function MealCard({
//   meal,
// }: MealCardProps) {
//   const progress = (meal.served / meal.totalStaff) * 100;

//   return (
//     <motion.div
//       whileHover={{
//         y: -8,
//         scale: 1.02,
//       }}
//       transition={{
//         duration: .25,
//       }}
//       className="
//         flex
//         flex-col
//         rounded-3xl
//         bg-white
//         p-3
//         shadow-[0_10px_25px_rgba(0,0,0,.12)]
//       "
//     >
//       {/* IMAGE */}

//       <img
//         src={meal.image}
//         alt={meal.name}
//         className="
//           h-40
//           w-full
//           rounded-2xl
//           object-cover
//         "
//       />

//       {/* CONTENT */}

//       <div className="mt-4 flex flex-1 flex-col">

//         <h3
//           className="
//             text-xl
//             font-semibold
//             text-gray-900
//           "
//         >
//           {meal.name}
//         </h3>

//         <div className="mt-3 flex items-end justify-between">

//           <div className="space-y-1">

//             <p className="text-sm text-gray-700">
//               Staff: {meal.totalStaff}
//             </p>

//             <p className="text-sm text-gray-700">
//               Served: {meal.served}
//             </p>

//           </div>

//           {/* Circular Progress */}

//           <div className="relative h-16 w-16">

//             <svg
//               className="-rotate-90"
//               width="64"
//               height="64"
//             >
//               <circle
//                 cx="32"
//                 cy="32"
//                 r="26"
//                 stroke="#E5E7EB"
//                 strokeWidth="6"
//                 fill="none"
//               />

//               <circle
//                 cx="32"
//                 cy="32"
//                 r="26"
//                 stroke="#6B7280"
//                 strokeWidth="6"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeDasharray={163.36}
//                 strokeDashoffset={
//                   163.36 - (163.36 * progress) / 100
//                 }
//               />
//             </svg>

//           </div>

//         </div>

//         <button
//           className="
//             mt-5
//             w-full
//             rounded-full
//             bg-gray-500
//             py-3
//             text-sm
//             font-medium
//             text-white
//             transition
//             hover:bg-gray-600
//           "
//         >
//           Mark Eaten
//         </button>

//       </div>
//     </motion.div>
//   );
// }