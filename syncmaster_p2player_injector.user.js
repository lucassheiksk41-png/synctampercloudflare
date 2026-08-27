// ==UserScript==
// @name         SYNC MASTER - P2PLAYER
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Bolha M Neon (Estilo P2) + Sync Automático via GitHub!
// @author       Você & Omini
// @match        *://painel.p2player.top/*
// @match        *://*.p2player.top/*
// @match        *://*.p2-player.com/*
// @match        *://p2-player.com/*
// @updateURL    https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/syncmaster_p2player_injector.user.js
// @downloadURL  https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/syncmaster_p2player_injector.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("🔮 ROCKET SYNC: Script iniciado (v1.9 - Acompanha Foguete + Sync)...");

    // 1. FUNÇÃO QUE CRIA APENAS A BOLHA "M"
    function injetarBolha() {
        if (document.getElementById('omini-bolha-p2-wrapper') || !document.body) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'omini-bolha-p2-wrapper';
        // Fica colado por baixo do Foguete Laranja (135px)
        wrapper.style.cssText = `
            position: fixed !important; top: 135px !important; right: 15px !important;
            z-index: 2147483647 !important; display: flex; flex-direction: column;
            align-items: flex-end; gap: 10px;
        `;

        const bolha = document.createElement('div');
        bolha.id = 'omini-bolha-p2-btn';
        bolha.style.cssText = `
            width: 48px; height: 48px; border-radius: 50%;
            background: linear-gradient(135deg, #020617, #1e3a8a);
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; box-shadow: 0 0 15px rgba(0, 246, 255, 0.6), inset 0 0 8px rgba(0, 246, 255, 0.3);
            border: 2px solid #00f6ff; transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
            user-select: none; -webkit-tap-highlight-color: transparent;
        `;
        bolha.innerHTML = `<span style="font-family: 'Arial Black', sans-serif; font-size: 24px; font-style: italic; color: #00f6ff; text-shadow: 0 0 10px #00f6ff;">M</span>`;

        function bolhaEstadoAberto() {
            bolha.innerHTML = `<span style="font-family: 'Arial Black', sans-serif; font-size: 20px; color: #ff0055; text-shadow: 0 0 10px #ff0055;">❌</span>`;
            bolha.style.background = `linear-gradient(135deg, #450a0a, #991b1b)`;
            bolha.style.borderColor = `#ff0055`;
            bolha.style.boxShadow = `0 0 15px rgba(255, 0, 85, 0.6), inset 0 0 8px rgba(255, 0, 85, 0.3)`;
        }

        function bolhaEstadoFechado() {
            bolha.innerHTML = `<span style="font-family: 'Arial Black', sans-serif; font-size: 24px; font-style: italic; color: #00f6ff; text-shadow: 0 0 10px #00f6ff;">M</span>`;
            bolha.style.background = `linear-gradient(135deg, #020617, #1e3a8a)`;
            bolha.style.borderColor = `#00f6ff`;
            bolha.style.boxShadow = `0 0 15px rgba(0, 246, 255, 0.6), inset 0 0 8px rgba(0, 246, 255, 0.3)`;
        }

        bolha.onclick = () => {
            bolha.style.transform = 'scale(0.8)';
            setTimeout(() => bolha.style.transform = 'none', 150);

            // Procura o botão fechar do painel
            let btnFechar = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.includes('❌ Fechar'));

            if (btnFechar && btnFechar.offsetHeight > 0) {
                btnFechar.click();
                bolhaEstadoFechado();
            } else {
                let s = document.createElement('script');
                s.src = 'https://syncmaster.lucassheiksk41.workers.dev?t=' + Date.now();
                document.body.appendChild(s);
                bolhaEstadoAberto();
            }
        };

        wrapper.appendChild(bolha);
        document.body.appendChild(wrapper);
    }

    // Tenta injetar logo no início
    setTimeout(injetarBolha, 500);

    // 2. CÃO DE GUARDA LEVE (Vigia apenas o estado do botão M)
    setInterval(() => {
        if (!document.body) return;
        injetarBolha(); // Garante que a bolha está na tela

        let btnFechar = Array.from(document.querySelectorAll('button')).find(e => e.textContent && e.textContent.includes('❌ Fechar'));
        let bolha = document.getElementById('omini-bolha-p2-btn');

        // Se a bolha estiver com o "❌", mas a janela do Sync não estiver mais na tela, reseta a bolha para o "M"
        if (bolha && bolha.innerHTML.includes('❌') && !btnFechar) {
            bolha.innerHTML = `<span style="font-family: 'Arial Black', sans-serif; font-size: 24px; font-style: italic; color: #00f6ff; text-shadow: 0 0 10px #00f6ff;">M</span>`;
            bolha.style.background = `linear-gradient(135deg, #020617, #1e3a8a)`;
            bolha.style.borderColor = `#00f6ff`;
            bolha.style.boxShadow = `0 0 15px rgba(0, 246, 255, 0.6), inset 0 0 8px rgba(0, 246, 255, 0.3)`;
        }
    }, 800);
})();
