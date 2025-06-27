export class GetProductsByCategory {
  static readonly type = '[Products] Get Products By Category';
  constructor(public payload: {idCategory: string}) { }
}

export class GetProductsById {
  static readonly type = '[Products] Get Products By Id';
  constructor(public payload: {id: string}) {}
}
