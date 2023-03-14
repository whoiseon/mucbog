export class Pagination<T> {
  posts: T[];
  totalPost: number;
  currentPage: number;
  limit: number;

  constructor(partial: Partial<Pagination<T>>) {
    Object.assign(this, partial);
  }

  get totalPosts(): number {
    return Math.ceil(this.totalPost / this.limit);
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPosts;
  }

  get hasPrevPage(): boolean {
    return this.currentPage > 1;
  }
}
