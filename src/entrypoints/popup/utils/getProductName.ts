import axios from 'axios';

export async function getProductName(origin: string, id: string) {
  const url = `${origin}/api/condensedSA/getSlave/?id=${id}&block=article_name`;

  const { data } = await axios.get(url);

  return data.sa?.article_name ?? `Product ${id} not found`;
}
