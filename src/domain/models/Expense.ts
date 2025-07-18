export class Expense {
  constructor(
    public category: string,
    public amount: number,
    public date: Date,
    public description?: string,
    public receiptImageUrl?: string,
  ) {}
}
