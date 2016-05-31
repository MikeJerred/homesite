declare module MJ.Models {
    export interface IVmPage<T> {
        pageNo: number;
        pageSize: number;
        items: T[];
        totalCount: number;
    }
}
