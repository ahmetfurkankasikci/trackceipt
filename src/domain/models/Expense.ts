export default class Expense {
  constructor(
    public category: string,
    public amount: number,
    public date: Date,
    public userId: string,
    public categoryId: string | null,
    public description?: string,
    public id?: string,
  ) { }
}
