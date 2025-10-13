type ProductItem = {
  id: number | string;
  url: string;
};

type IdsMap = Record<string, number | string>;

export async function getProductIdsByShop(id: string): Promise<IdsMap> {
  const url = `https://www.prolodev.prologistics.info/api/condensedList/getList?saved_id=${id}`;

  const response = await fetch(url);

  const data = await response.json();

  const list = data.saCollection.list as ProductItem[];

  const ids: IdsMap = {};

  list.forEach((item: ProductItem) => {
    ids[item.url] = String(item.id);
  });

  return ids;
}
