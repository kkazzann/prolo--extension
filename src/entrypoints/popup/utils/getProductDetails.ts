import axios from 'axios';

export async function getProductDetails(origin: string, id: string) {
  const url = `${origin}/api/condensedSA/getSlave/?id=${id}&block=buttons`;

  const { data } = await axios.get(url);

  // Handle optional buttons field
  const buttons = data?.sa?.buttons;
  const sad = data.sa?.data;

  let details = {
    url: buttons?.default_url ?? '',
    price: sad?.ShopPrice ?? '00.00',
    oldPrice: sad?.ShopHPrice ?? '00.00',
  };

  return details;
}
