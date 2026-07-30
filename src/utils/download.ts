export function downloadCSV(
data:any[],
filename:string
){

const headers =
Object.keys(data[0]);



const csv = [

headers.join(","),


...data.map(row=>

headers.map(
field=>row[field]
).join(",")

)

].join("\n");



const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);



const url =
URL.createObjectURL(blob);



const link =
document.createElement("a");


link.href=url;

link.download=filename;


link.click();


URL.revokeObjectURL(url);

}