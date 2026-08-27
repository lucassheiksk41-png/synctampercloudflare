// ==UserScript==
// @name         SYNC MASTER - DNA
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Bolha M Azul, Topo da tela (Estilo P2) + Sync GitHub!
// @author       Você & Omini
// @match        *://cms.omini.fit/*
// @match        *://*.omini.fit/*
// @match        *://*.dna-go.com/*
// @match        *://*.dnago.com/*
// @match        *://painel.dnago/*
// @match        *://*/*dnago*
// @updateURL    https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/syncmaster_dna_injector.user.js
// @downloadURL  https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/syncmaster_dna_injector.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('omini-bolha-master-wrapper')) return;

    console.log("🟦 SYNC MASTER - DNA: Script iniciado (Versão 5.4 - Azul P2 + Sync)...");

    // ==========================================
    // INJETOR DE ESTILOS PREMIUM AZUL (Força o design no script externo)
    // ==========================================
    const stylePremium = document.createElement('style');
    stylePremium.innerHTML = `
        #omini-sync-card-premium {
            background: #0f172a !important;
            border: 1px solid #0ea5e9 !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.9), 0 0 10px rgba(14, 165, 233, 0.3) !important;
            font-family: 'Segoe UI', sans-serif !important;
        }
        #omini-sync-card-premium * {
            color: #f8fafc !important;
            border-color: #334155 !important;
        }
        #omini-sync-card-premium input, #omini-sync-card-premium textarea, #omini-sync-card-premium select {
            background: #020617 !important;
            color: #38bdf8 !important;
            border: 1px solid #0369a1 !important;
            border-radius: 4px !important;
            outline: none !important;
        }
        #omini-sync-card-premium input:focus, #omini-sync-card-premium textarea:focus {
            border-color: #38bdf8 !important;
        }
        #omini-sync-card-premium button {
            background: linear-gradient(135deg, #0284c7, #0ea5e9) !important;
            color: #fff !important;
            border: 1px solid #38bdf8 !important;
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.4) !important;
            border-radius: 4px !important;
            font-weight: 900 !important;
            cursor: pointer !important;
            transition: 0.2s !important;
        }
        #omini-sync-card-premium button:hover {
            filter: brightness(1.2) !important;
        }
    `;
    document.head.appendChild(stylePremium);

    // Cria a estrutura da bolha Azul (Igual ao P2 Player)
    const wrapper = document.createElement('div');
    wrapper.id = 'omini-bolha-master-wrapper';

    // Posicionado no topo (Top: 130px) logo abaixo da bolha do Injetor (que está no Top: 70px)
    wrapper.style.cssText = `
        position: fixed !important; top: 130px !important; right: 15px !important;
        z-index: 2147483647 !important; display: flex; flex-direction: column;
        align-items: flex-end; gap: 10px;
    `;

    const bolha = document.createElement('div');
    bolha.id = 'omini-bolha-master-btn';
    bolha.style.cssText = `
        width: 46px; height: 46px; border-radius: 50%;
        background: linear-gradient(135deg, #0369a1, #0ea5e9);
        display: flex; justify-content: center; align-items: center;
        font-size: 20px; cursor: pointer;
        box-shadow: 0 0 15px rgba(14, 165, 233, 0.6), inset 0 0 8px rgba(14, 165, 233, 0.4);
        border: 2px solid #22d3ee; transition: transform 0.2s, background 0.2s;
        user-select: none; -webkit-tap-highlight-color: transparent;
    `;
    bolha.innerHTML = `<span style="font-size: 22px; font-weight: 900; font-style: italic; color: #fff; filter: drop-shadow(0 0 5px #22d3ee);">M</span>`;

    // Função para alterar a bolha para o estado "Aberto" (X Vermelho)
    function bolhaEstadoAberto() {
        bolha.innerHTML = `❌`;
        bolha.style.background = `linear-gradient(135deg, #450a0a, #991b1b)`;
        bolha.style.borderColor = `#ff0055`;
    }

    // Função para alterar a bolha para o estado "Fechado" (Bola M Azul)
    function bolhaEstadoFechado() {
        bolha.innerHTML = `<span style="font-size: 22px; font-weight: 900; font-style: italic; color: #fff; filter: drop-shadow(0 0 5px #22d3ee);">M</span>`;
        bolha.style.background = `linear-gradient(135deg, #0369a1, #0ea5e9)`;
        bolha.style.borderColor = `#22d3ee`;
    }

    // LÓGICA DE ABRIR E FECHAR CORRETA
    bolha.onclick = () => {
        bolha.style.transform = 'scale(0.8)';
        setTimeout(() => bolha.style.transform = 'none', 150);

        // Procura se o botão "Fechar" do seu script já está na tela
        let btnFechar = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === '❌ Fechar');

        if (btnFechar && btnFechar.offsetHeight > 0) {
            // SE ESTIVER ABERTO: Clica no botão fechar do SEU script
            btnFechar.click();
            bolhaEstadoFechado();
        } else {
            // SE ESTIVER FECHADO: Roda o seu Bookmarklet 100% original
            let s = document.createElement('script');
            s.src = 'https://syncmaster.lucassheiksk41.workers.dev?t=' + Date.now();
            document.body.appendChild(s);
            bolhaEstadoAberto();
        }
    };

    wrapper.appendChild(bolha);
    document.body.appendChild(wrapper);

    // ==========================================
    // O CÃO DE GUARDA (Tamanho, Posição e Pintura Premium)
    // ==========================================
    setInterval(() => {
        // Encontra o botão de Fechar exclusivo do seu script
        let btnFechar = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === '❌ Fechar');

        if (btnFechar) {
            // Sobe nas camadas para achar o "Card" (O fundo cinza onde ficam os inputs)
            let card = btnFechar.parentElement;
            while(card && card.tagName === 'DIV') {
                let bg = window.getComputedStyle(card).backgroundColor;
                // Acha o primeiro div que tem uma cor de fundo que não é invisível
                if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    break;
                }
                card = card.parentElement;
            }

            if (card && !card.dataset.ominiFormatado) {
                card.dataset.ominiFormatado = "sim";
                card.id = "omini-sync-card-premium"; // Aplica o ID que puxa o CSS Injetado Azul

                // 1. Tira a escuridão que bloqueia a tela inteira (o backdrop)
                let backdrop = card.parentElement;
                if (backdrop && window.getComputedStyle(backdrop).position === 'fixed') {
                    backdrop.style.background = 'transparent';
                    backdrop.style.pointerEvents = 'none';
                    card.style.pointerEvents = 'auto';
                }

                // 2. Modela a caixinha e põe no lugar certo lá em cima
                card.style.position = 'fixed';
                card.style.top = '130px'; // Mesma altura da bolha M
                card.style.left = 'auto';
                card.style.bottom = 'auto'; // Remove o travamento no bottom
                card.style.right = '75px'; // Lado esquerdo da bolha
                card.style.transform = 'scale(0.85)'; // Um pouco maior para os inputs caberem bem
                card.style.transformOrigin = 'top right'; // A animação agora nasce de cima para baixo
                card.style.margin = '0';
                card.style.zIndex = '2147483646';

                // Garante que o usuário possa rolar a página por trás
                document.body.style.overflow = 'auto';

                // 3. Se você fechar pelo botão do painel, a bolha volta a ficar no estado normal
                btnFechar.addEventListener('click', () => {
                    bolhaEstadoFechado();
                });
            }
        }
    }, 300); // Vigia a tela a cada 0.3 segundos
})();
