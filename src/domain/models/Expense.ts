export default class Expense {
  constructor(
    public category: string,
    public amount: number,
    public date: Date,
    public userId: string,
    public description?: string,
    public receiptImageUrl?: string,
  ) {}
}
