import axios from 'axios';

type itemType = {
  username: string;
  id: string;
  url: string;
};

type ShopData = {
  id: string;
  shopUrl: string;
};

type IdsMap = Record<string, ShopData>;

// username to slug eg. "Beliani AT" -> "AT", "Beliani" -> "CH"
function getSlug(text: string) {
  let slug = text;

  if (text === 'Beliani') {
    slug = 'CH';
  } else if (text.startsWith('Beliani ')) {
    slug = text.replace('Beliani ', '');
  }

  return slug;
}

export async function getProductIdsByShop(origin: string, id: string) {
  const url = `${origin}/api/condensedList/getList?saved_id=${id}`;

  const { data } = await axios.get(url);

  const list = data.saCollection.list;

  const ids: IdsMap = {};

  list.forEach((item: itemType) => {
    ids[getSlug(item.username)] = {
      id: String(item.id),
      shopUrl: item.url,
    };

    // example output:
    // "DE": {
    //   "id": item.id,
    //   "shopUrl": item.url
    // }
  });

  return ids;
}
