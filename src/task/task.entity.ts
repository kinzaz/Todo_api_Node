export class Task {
  constructor(    private readonly _title: string,
    private readonly _description: string
) {}

  get title() {
    return this._title
  }

  get description() {
    return this._description
  }
}
