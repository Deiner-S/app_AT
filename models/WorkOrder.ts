export default interface WorkOrder{
    operation_code:string;
    symptoms:string;
    client:number;
    chassi:string;
    orimento:string;
    model:string;
    date_in:Date;
    date_out:Date;
    status:string;
    service:string;
    insert_date:Date;
}