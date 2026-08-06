import {
useQuery,
useMutation,
useQueryClient
} from "@tanstack/react-query";


import {
staffService
} from "../services/staff.service";


import type {
CreateStaffPayload
} from "../types/staff";




export function useStaff(){

return useQuery({

queryKey:["staff"],

queryFn:
staffService.getAll,

});


}




export function useCreateStaff(){


const queryClient =
useQueryClient();


return useMutation({


mutationFn:
(data:CreateStaffPayload)=>
staffService.create(data),



onSuccess(){

queryClient.invalidateQueries({

queryKey:["staff"]

});

}


});


}

export function useImportStaff(){


const queryClient =
useQueryClient();



return useMutation({


mutationFn:
(file:File)=>
staffService.importStaff(file),



onSuccess(){

queryClient.invalidateQueries({

queryKey:["staff"]

});


}


});


}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffService.delete,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
    },
  });
}