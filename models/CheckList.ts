export default interface CheckList{
    id?: number
    checklist_item_fk:number
    work_order_fk:number
    status:string
    status_sync?: number
    img?: Uint8Array | null

}