// instagram_auto_poster.js
// Script para postar no Instagram 100% debaixo dos panos (Sem tela/Sem Cliques)

const axios = require('axios');
require('dotenv').config();

// 1. Você precisará destas credenciais que vêm lá do portal developer.facebook.com
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID; 

/**
 * Função para criar o container da mídia (sobe a foto pro servidor do Meta)
 */
async function uploadMedia(imageUrl, caption) {
    try {
        console.log("🚀 Sincronizando com a Matrix da Meta...");
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media`, 
            {
                image_url: imageUrl, 
                caption: caption,
                access_token: ACCESS_TOKEN
            }
        );
        return response.data.id; // Retorna o ID da foto "pré-carregada"
    } catch (error) {
        console.error("Erro no Upload:", error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Função para "Apertar o botão de Publicar" invisível
 */
async function publishMedia(creationId) {
    try {
        console.log("✅ Publicando no seu Feed...");
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media_publish`, 
            {
                creation_id: creationId,
                access_token: ACCESS_TOKEN
            }
        );
        console.log(`🎉 Sucesso! Post no ar! ID da Publicação: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao Publicar:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Quando o agente chamar este arquivo, esta é a função que ele roda:
async function agentePostar(imageUrl, legenda) {
    try {
        // Passo 1: O código sobe a imagem (a mídia precisa estar em uma URL pública)
        const creationId = await uploadMedia(imageUrl, legenda);
        
        // Passo 2: O código manda o comando final de publicação
        await publishMedia(creationId);
    } catch (error) {
        console.log("Automação falhou por falta de acesso. Verifique seu Token.");
    }
}

// Simulando a execução do agente:
const legendaOtimizada = "O sol de Cuiabá nunca foi tão lucrativo. ☀️ Reduza 95% da conta com a Green Power Energia Solar! #EnergiaLimpa";

// A imagem precisa estar hospedada em uma URL (podemos usar S3, Imgur ou seu proprio site)
const urlDaImagem = "https://seusite.com.br/artes/my_solar_feed_post_1_1.png";

// Descomente a linha abaixo para ligar a máquina após configurar o .env
// agentePostar(urlDaImagem, legendaOtimizada);

module.exports = { agentePostar };
