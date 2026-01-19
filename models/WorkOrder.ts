export default interface WorkOrder {
  operation_code: number;
  client: string;
  symptoms: string;
  chassi?: string;
  orimento?: string;
  model?: string;
  date_in?: string;
  date_out?: string;
  status: string;
  statusSync : number;
  service?: string;
  img?:string
  insert_date?: string;
}