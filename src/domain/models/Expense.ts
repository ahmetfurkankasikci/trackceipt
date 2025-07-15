export class Expense {
  constructor(
    public id: number,
    public category: string,
    public amount: number,
    public date: Date,
    public description?: string
  ) {}
}
