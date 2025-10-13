import { getProductIdsByShop } from './getProductIdsByShop';
import { getProductName } from './getProductName';
import { getProductDetails } from './getProductDetails';

type ShopDetails = {
  price: string;
  oldPrice: string;
  url: string;
  id: string;
};

export async function getTableData() {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0].id!;

    browser.tabs
      .sendMessage(activeTab, { action: 'getTableData' })
      .then(async response => {
        if (response?.exists) {
          console.log('Table found!');

          const rows = response.rows;

          for (const row of rows) {
            const productId = row.value;
            const productName = await getProductName(productId);
            const productMap = await getProductIdsByShop(productId);

            const shopDetails: Record<string, ShopDetails> = {};

            const entries = Object.entries(productMap);
            const results = await Promise.all(
              entries.map(async ([shopUrl, shopProductId]) => {
                const details = await getProductDetails(shopProductId as string);

                const productUrl = new URL(`https://${shopUrl}`);
                productUrl.hostname = shopUrl;
                productUrl.pathname = details.url;

                return [
                  shopUrl,
                  {
                    id: shopProductId as string,
                    price: details.price,
                    oldPrice: details.oldPrice,
                    url: productUrl.href,
                  } as ShopDetails,
                ] as const;
              }),
            );

            for (const [shopUrl, shopData] of results) {
              shopDetails[shopUrl] = shopData;
            }

            const product = {
              id: productId,
              name: productName,
              shops: shopDetails,
            };

            console.log('Product with shop details:', product);
          }
        } else {
          console.log('Table not found');
        }
      })
      .catch(error => {
        console.error('Could not send message:', error);
      });
  } catch (err) {
    console.error(err);
  }
}
