declare module MJ.DataServices {
    export interface IPage<T> extends ng.resource.IResource<IPage<T>> {
        pageNo: number;
        pageSize: number;
        items: T[];
        totalCount: number;
    }
}