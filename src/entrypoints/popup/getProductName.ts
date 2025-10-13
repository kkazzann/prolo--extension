export async function getProductName(id: string) {
  const url = `https://www.prolodev.prologistics.info/api/condensedSA/get/?id=${id}&block=article_name`;

  const response = await fetch(url);

  const data = await response.json();

  return data.sa.article_name;
}
