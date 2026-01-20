export default interface CheckList{
    id?: number
    checklist_fk:number
    serviceOrder_fk:number
    status:string
    status_sync?: number
    img?: Uint8Array | null

}