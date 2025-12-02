export default class Expense {
  constructor(
    public category: string,
    public amount: number | null,
    public date: Date,
    public userId: string,
    public categoryId: string | null,
    public shopName?: string,
    public id?: string,
  ) { }
}
