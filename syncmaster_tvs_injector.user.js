// ==UserScript==
// @name         SYNC MASTER - TVS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bolha M Roxa (Lockdefense) + Sync GitHub!
// @author       Você & Omini
// @match        *://*.lockdefense.top/*
// @match        *://lockdefense.top/*
// @updateURL    https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/syncmaster_tvs_injector.user.js
// @downloadURL  https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/syncmaster_tvs_injector.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('omini-bolha-tvs-wrapper')) return;

    console.log("🟪 SYNC MASTER - TVS: Script iniciado (Versão 1.0 - Lockdefense)...");

    // ==========================================
    // INJETOR DE ESTILOS PREMIUM ROXO (Armadura de Titânio TVS)
    // ==========================================
    const stylePremium = document.createElement('style');
    stylePremium.innerHTML = `
        #omini-sync-card-premium {
            background: #0f172a !important; border: 1px solid #8b5cf6 !important;
            border-radius: 8px !important; box-shadow: 0 10px 25px rgba(0,0,0,0.9), 0 0 10px rgba(139, 92, 246, 0.3) !important;
            font-family: 'Segoe UI', sans-serif !important;
        }
        #omini-sync-card-premium * { color: #f8fafc !important; border-color: #334155 !important; }
        #omini-sync-card-premium input, #omini-sync-card-premium textarea, #omini-sync-card-premium select {
            background: #020617 !important; color: #c4b5fd !important; border: 1px solid #6d28d9 !important;
            border-radius: 4px !important; outline: none !important;
        }
        #omini-sync-card-premium input:focus, #omini-sync-card-premium textarea:focus { border-color: #a78bfa !important; }
        #omini-sync-card-premium button {
            background: linear-gradient(135deg, #6d28d9, #8b5cf6) !important; color: #fff !important;
            border: 1px solid #a78bfa !important; box-shadow: 0 0 10px rgba(139, 92, 246, 0.4) !important;
            border-radius: 4px !important; font-weight: 900 !important; cursor: pointer !important; transition: 0.2s !important;
        }
        #omini-sync-card-premium button:hover { filter: brightness(1.2) !important; }
    `;
    document.head.appendChild(stylePremium);

    const wrapper = document.createElement('div');
    wrapper.id = 'omini-bolha-tvs-wrapper';
    wrapper.style.cssText = `
        position: fixed !important; top: 130px !important; right: 15px !important;
        z-index: 2147483647 !important; display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
    `;

    const bolha = document.createElement('div');
    bolha.id = 'omini-bolha-tvs-btn';
    bolha.style.cssText = `
        width: 46px; height: 46px; border-radius: 50%;
        background: linear-gradient(135deg, #4c1d95, #7c3aed);
        display: flex; justify-content: center; align-items: center; cursor: pointer;
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.6), inset 0 0 8px rgba(139, 92, 246, 0.4);
        border: 2px solid #a78bfa; transition: transform 0.2s, background 0.2s; user-select: none;
    `;
    bolha.innerHTML = `<span style="font-size: 22px; font-weight: 900; font-style: italic; color: #fff; filter: drop-shadow(0 0 5px #a78bfa);">M</span>`;

    function bolhaEstadoAberto() {
        bolha.innerHTML = `❌`; bolha.style.background = `linear-gradient(135deg, #450a0a, #991b1b)`; bolha.style.borderColor = `#ff0055`;
    }

    function bolhaEstadoFechado() {
        bolha.innerHTML = `<span style="font-size: 22px; font-weight: 900; font-style: italic; color: #fff; filter: drop-shadow(0 0 5px #a78bfa);">M</span>`;
        bolha.style.background = `linear-gradient(135deg, #4c1d95, #7c3aed)`; bolha.style.borderColor = `#a78bfa`;
    }

    bolha.onclick = () => {
        bolha.style.transform = 'scale(0.8)'; setTimeout(() => bolha.style.transform = 'none', 150);
        let btnFechar = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === '❌ Fechar');
        if (btnFechar && btnFechar.offsetHeight > 0) {
            btnFechar.click(); bolhaEstadoFechado();
        } else {
            // 🚀 SEU LINK DO WORKER JÁ ESTÁ AQUI
            let linkDoWorkerTVS = 'https://tvsmastersync.lucassheiksk41.workers.dev';
            
            let s = document.createElement('script');
            s.src = linkDoWorkerTVS + '?t=' + Date.now();
            document.body.appendChild(s); bolhaEstadoAberto();
        }
    };

    wrapper.appendChild(bolha); document.body.appendChild(wrapper);

    // VIGIA DO ESTILO E POSICIONAMENTO DA TELA
    setInterval(() => {
        let btnFechar = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.trim() === '❌ Fechar');
        if (btnFechar) {
            let card = btnFechar.parentElement;
            while(card && card.tagName === 'DIV') {
                let bg = window.getComputedStyle(card).backgroundColor;
                if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') break;
                card = card.parentElement;
            }
            if (card && !card.dataset.ominiFormatado) {
                card.dataset.ominiFormatado = "sim"; card.id = "omini-sync-card-premium";
                
                let backdrop = card.parentElement;
                if (backdrop && window.getComputedStyle(backdrop).position === 'fixed') {
                    backdrop.style.background = 'transparent'; backdrop.style.pointerEvents = 'none'; card.style.pointerEvents = 'auto';
                }
                
                card.style.position = 'fixed'; card.style.top = '130px'; card.style.left = 'auto';
                card.style.bottom = 'auto'; card.style.right = '75px';
                card.style.transform = 'scale(0.85)'; card.style.transformOrigin = 'top right';
                card.style.margin = '0'; card.style.zIndex = '2147483646';
                document.body.style.overflow = 'auto';
                
                btnFechar.addEventListener('click', () => bolhaEstadoFechado());
            }
        }
    }, 300);
})();
