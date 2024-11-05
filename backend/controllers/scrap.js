const puppeteer = require('puppeteer-extra');
const Url= require('../model/url');
const VisitedUrl= require('../model/visitedurl')
// const Upc = require('../model/upc');
const Data = require('../model/product');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const AutoFetchData= require('../model/autofetchdata')
exports.fetchurl = async (req, res) => {
    try {
        const url = req.body.url;
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        // Set user agent and additional headers
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
        });

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 360000
        });

        const utagData = await page.evaluate(() => {
            return typeof utag_data !== 'undefined' ? utag_data : null;
        });
     console.log(utagData)
     let datas = await Data.find({ vendorURL: url });

        const price = utagData.sku_price;
        const offer= utagData.product_promotedCoupon[0];
        const offerprice = offer.cpnDiscount !== undefined ? offer.cpnDiscount : null
        const upc = utagData.sku_upc;
        var urlProduct = upc.map((u, index) => {
            return { upc: u, price: price[index] }
        })
        // -----filter product-----
        let filterData = datas.map((data) => {
            const matchedProduct = urlProduct.find((p) => p.upc === data.upc);
            if (matchedProduct) {
                return {
                    upc: data.upc,
                    newPrice: matchedProduct.price,
                    oldPrice: data.productCost,
                    isChange: data.productCost !== matchedProduct.price,
                    offer:offerprice
                };
            }
            return null;
        }).filter(item => item !== null);
        await browser.close();
        res.send(filterData);
    } catch (error) {
        console.error('Error scraping the webpage:', error);
        res.status(500).json({ message: 'Error scraping the webpage' });
    }
};


exports.checkurl = async (req, res) => {
    try {
        const url = req.body.url;
        let datas = await Data.find({ vendorURL: url });
        // Launch Puppeteer instance in non-headless mode
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        // Set user agent and additional headers
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
        });

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 360000
        });

        const utagData = await page.evaluate(() => {
            return typeof utag_data !== 'undefined' ? utag_data : null;
        });
        const price = utagData.sku_price;
        const upc = utagData.sku_upc;
        const quantity = utagData.sku_inventory;
        const imgurl = utagData.sku_image_url;
        const offer= utagData.product_promotedCoupon[0];
        const onsale= utagData.sku_on_sale;
        const offerprice = offer.cpnDiscount !== undefined ? offer.cpnDiscount : null
        var urlProduct = upc.map((u, index) => {
            return { upc: u, price: price[index], quantity: quantity[index], imgurl: imgurl[index],onsale: onsale[index] }
        })
        // -----filter product-----
        let filterData = datas.map((data) => {
            const matchedProduct = urlProduct.find((p) => p.upc === data.upc);
            if (matchedProduct) {
                return {
                    url: data.vendorURL,
                    quantity: matchedProduct.quantity,
                    imgurl: matchedProduct.imgurl,
                    upc: data.upc,
                    clrsize:data.colorSize,
                    newPrice: matchedProduct.price,
                    oldPrice: data.productCost,
                    available: data.available,
                    offer:offerprice,
                    onsale: matchedProduct.onsale
                };
            }
            return null;
        }).filter(item => item !== null);
        await browser.close();
        res.send(filterData);
    } catch (error) {
        console.error('Error scraping the webpage:', error);
        res.status(500).json({ message: 'Error scraping the webpage' });
    }
};


exports.autofetchdata= async (req,res)=>{
    try {
console.log("autofetch")
        const url = req.body.link;
        let datas = await Data.find({ vendorURL: url });
        // Launch Puppeteer instance in non-headless mode
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        // Set user agent and additional headers
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            // 'Authorization': `Bearer ${apiKey}`
        });


        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 360000
        });

        const utagData = await page.evaluate(() => {
            return typeof utag_data !== 'undefined' ? utag_data : null;
        });

        const price = utagData.sku_price;
        const upc = utagData.sku_upc;
        const quantity = utagData.sku_inventory;
        const imgurl = utagData.sku_image_url;
        const offer= utagData.product_promotedCoupon[0];
        const onsale= utagData.sku_on_sale;
      
        const offerprice = offer.cpnDiscount !== undefined ? offer.cpnDiscount : null
        const offerend= offer.endDate !== undefined ? offer.endDate: null
        var urlProduct = upc.map((u, index) => {
            return { upc: u, price: price[index], quantity: quantity[index], imgurl: imgurl[index],onsale: onsale[index] }
        })
        console.log(urlProduct)
        // -----filter product-----
        let filterData = datas.map((data) => {
            const matchedProduct = urlProduct.find((p) => p.upc === data.upc);
            if (matchedProduct) {
                
                return {
                    url: data.vendorURL,
                    quantity: matchedProduct.quantity,
                    imgurl: matchedProduct.imgurl,
                    upc: data.upc,
                    clrsize:data.colorSize,
                    newPrice: matchedProduct.price,
                    oldPrice: data.productCost,
                    available: data.available,
                    offer:offerprice,
                    onsale: matchedProduct.onsale,
                    offerend:offerend.split(' ')[0]
                };
            }
            return null;
        }).filter(item => item !== null);
        VisitedUrl.findOneAndDelete({url:url})
        await browser.close();


        // ---save data into database
        for (const d of filterData) {
            console.log(d)
            const autofetchdata = new AutoFetchData(d);
         var r=await autofetchdata.save();
        }
        if(r){
            res.status(200).send(true);
        }
        
    } catch (error) {
        console.error('Error scraping the webpage:', error);
        res.status(500).send(false);
    }
}

