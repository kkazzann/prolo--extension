export async function getProductDetails(id: string) {
  const url = `https://www.prolodev.prologistics.info/api/condensedSA/getSlave/?id=${id}&block=buttons`;

  const response = await fetch(url);

  const data = await response.json();

  let details = {
    url: data.sa.buttons.default_url,
    price: data.sa.data.ShopPrice,
    oldPrice: data.sa.data.ShopHPrice,
  };

  return details;
}
