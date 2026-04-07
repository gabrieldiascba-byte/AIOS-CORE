const axios = require('axios');
require('dotenv').config();

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

async function postarNoInstagram() {
    console.log("🤖 Iniciando o Teste de Postagem (Sem Cliques)...");
    
    // Foto de teste profissional em HD de uma galeria pública
    const urlDaImagem = "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1080&auto=format&fit=crop";
    const legenda = "☀️ Teste oficial da máquina de vendas automatizada da Green Power Energia Solar! Integrando Inteligência Artificial direto no coração do nosso Marketing. 🚀🔌 #EnergiaSolarCuiaba #GreenPower #Inovacao";

    try {
        console.log("✈️ 1. Transferindo foto para a plataforma da Meta...");
        const response1 = await axios.post(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media`, {
            image_url: urlDaImagem,
            caption: legenda,
            access_token: ACCESS_TOKEN
        });
        
        const creationId = response1.data.id;
        console.log(`✅ Imagem aceita! (Container ID: ${creationId})`);
        console.log("⚡ 2. Dando o comando final de publicação invisível...");

        const response2 = await axios.post(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media_publish`, {
            creation_id: creationId,
            access_token: ACCESS_TOKEN
        });

        console.log(`\n🎉 SUCESSO! Post enviado via CÓDIGO! (Post ID: ${response2.data.id})`);
        console.log("📱 Pegue seu celular ou abra o seu Instagram web agora para conferir lá no Topo do Feed!");
    } catch (error) {
        console.error("\n🚨 Algo barrou a nossa entrada:");
        console.dir(error.response ? error.response.data : error.message, { depth: null });
    }
}

postarNoInstagram();
