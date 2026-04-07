require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

async function uploadToCloud(filePath) {
    const data = new FormData();
    data.append('reqtype', 'fileupload');
    data.append('fileToUpload', fs.createReadStream(filePath));
    const res = await axios.post('https://catbox.moe/user/api.php', data, {
        headers: data.getHeaders()
    });
    return res.data; 
}

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const htmlPath = 'file:///' + path.resolve(__dirname, '../carrossel_preview.html').replace(/\\/g, '/');
    await page.goto(htmlPath, { waitUntil: 'networkidle2' });
    
    await page.evaluate(() => {
        document.body.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.gap = '0';
        document.body.style.display = 'block';
    });

    const slides = await page.$$('.slide');
    const imageUrls = [];
    
    for (let i = 0; i < slides.length; i++) {
        const slidePath = path.resolve(__dirname, `temp_slide_${i}.png`);
        const box = await slides[i].boundingBox();
        await page.screenshot({ path: slidePath, clip: { x: box.x, y: box.y, width: 600, height: 600 } });
        
        const externalUrl = await uploadToCloud(slidePath);
        imageUrls.push(externalUrl);
    }
    await browser.close();

    const childrenIds = [];
    for (let i = 0; i < imageUrls.length; i++) {
        const res = await axios.post(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media`, {
            image_url: imageUrls[i],
            is_carousel_item: true,
            access_token: ACCESS_TOKEN
        });
        childrenIds.push(res.data.id);
    }

    console.log("Dando 10s pro Zuckerberg engolir as fotos 8k gigantes...")
    await new Promise(r => setTimeout(r, 10000));

    const carouselRes = await axios.post(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media`, {
        media_type: 'CAROUSEL',
        children: childrenIds.join(','),
        caption: "⚠️ Não compre Energia Solar antes de ler este documento.\n\nO que o mercado comum tenta esconder de você em Cuiabá? Existe o risco gravíssimo nas falsas promessas de 'conta R$0,00' e o perigo oculto da fiação barata no telhado da residência da sua família.\n\nNa Green Power, nós não vendemos placas com fita adesiva. Nós comercializamos Autonomia e Inteligência Energética de longo prazo para propriedades Premium.\n\n⚡ Acesso o Link na Bio para falar com a nossa Engenharia e focar em resultados limpos.\n\n#GreenPower #EnergiaSolarCuiaba #MatoGrossoSolar #Sustentabilidade",
        access_token: ACCESS_TOKEN
    });

    const carouselId = carouselRes.data.id;
    console.log(`Pacote submetido (ID: ${carouselId}). Aguardando processamento da publicação...`);
    
    await new Promise(r => setTimeout(r, 15000)); // PAUSA GIGANTE para a API não reclamar

    const publishRes = await axios.post(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media_publish`, {
        creation_id: carouselId,
        access_token: ACCESS_TOKEN
    });

    console.log("VAI LÁ CONFERIR O FEED! FOI PUBLICADO!");
}

run().catch(err => {
    console.error("ERRO:", err.response ? err.response.data : err.message);
});
