import puppeteer from 'puppeteer';
import namer from 'color-namer';

const scrapeProductDetails = async (url: string) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.product__media-item');

        const imageUrls = await page.$$eval(
            '.product__media-item, .product__zoom',
            (elements) =>
                elements
                    .map((el) => {
                        const img = el.querySelector('img');
                        const imgSrc = img?.getAttribute('src');

                        const zoomSrc = el.getAttribute('data-product-detail-zoom');

                        return zoomSrc
                            ? `https:${zoomSrc}`
                            : imgSrc
                            ? `https:${imgSrc}`
                            : null;
                    })
                    .filter(
                        (url) =>
                            url !== null &&
                            !url.includes('play-button') &&
                            !url.includes('pause-button') &&
                            !url.includes('lazy-placeholder')
                    )
        );

        const uniqueImageUrls = [...new Set(imageUrls)];

        const description = await page.$$eval('.product-details__content-inner li', (items) =>
            items.map((item) => item.textContent?.trim()).join('\n')
        );

        const colorsWithHex = await page.$$eval('.product__swatches a', (swatches) =>
            swatches.map((swatch) => {
                const style = swatch.getAttribute('style');
                const match = style?.match(/background-color:\s*(#[a-fA-F0-9]+);?/);
                return match ? match[1] : null;
            }).filter((color) => color !== null)
        );

        const colors = colorsWithHex.map((hex) => ({
            hex,
            name: namer(hex).basic[0].name,
        }));

        const sizes = await page.$$eval('.product__select-sizes-item button', (buttons) =>
            buttons.map((button) => button.getAttribute('data-size-value'))
        );

        const price = await page.$eval('.product__sale-price-row [data-product-price]', (priceEl) =>
            priceEl.textContent?.trim()
        );

        const productDetails = {
            imageUrls: uniqueImageUrls,
            description,
            colors,
            sizes,
            price,
        };

        console.log('Product Details:', productDetails);

        return productDetails;
    } catch (error) {
        console.error('Error scraping product details:', error);
    } finally {
        await browser.close();
    }
};

const productUrl =
    'https://us.princesspolly.com/products/harmony-sweater-blue';

scrapeProductDetails(productUrl);
