declare module MJ.DataServices {
    export interface IPage<T> extends MJ.Models.IVmPage<T>, ng.resource.IResource<IPage<T>> {}
}