import * as Immutable from 'immutable';
import { IVmPage } from '@homesite/shared';

export default class Page<T> {
    private constructor(
        public pageNo: number,
        public pageSize: number,
        public items: Immutable.Iterable<number, T>,
        public totalCount: number) {
    }

    static build<T>(pageNo: number, pageSize: number, items: T[], totalCount: number): Page<T> {
        return new Page(pageNo, pageSize, Immutable.Seq(items), totalCount);
    }

    map<U>(transform: (item: T) => U): Page<U> {
        return new Page<U>(
            this.pageNo,
            this.pageSize,
            this.items.map(transform),
            this.totalCount);
    }

    toVmPage(): IVmPage<T> {
        return {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            items: this.items.toArray(),
            totalCount: this.totalCount
        };
    }
}
