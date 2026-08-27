// ==UserScript==
// @name         INJETOR P2 PLAYER CLOUDFLARE
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  Armadura de Titânio + Troca Inteligente DNS 1 e DNS 2
// @author       Você & Omini
// @match        *://painel.p2player.top/*
// @match        *://*.p2player.top/*
// @match        *://p2player.top/*
// @match        *://*.p2-player.com/*
// @match        *://p2-player.com/*
// @match        *://*.bobplayer.com/*
// @match        *://*.iboplayer.com/*
// @match        *://*.iboproapp.com/*
// @updateURL    https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/p2player_injector.user.js
// @downloadURL  https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/p2player_injector.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // ⚙️ SUAS CONFIGURAÇÕES INTELIGENTES (Altere os textos entre aspas)
    // =========================================================================
    // 🟣 PADRÃO PARA O BOB PLAYER:
    const BOB_DNS1 = "http://bttlinkcon.sbs:8880";
    const BOB_NOME1 = "Lista 1 - BTV";
    const BOB_FMT1 = "m3u8";

    const BOB_DNS2 = "http://backup-btv.sbs"; // Coloque seu DNS 2 do BOB aqui
    const BOB_NOME2 = "Backup VIP";
    const BOB_FMT2 = "ts";

    // 🟢🔴🔵 PADRÃO PARA IBO, IBO PRO E SMART ONE:
    const OUTROS_DNS1 = "http://sharklinkib.sbs:80";
    const OUTROS_NOME1 = "LISTA 1 - SHARK";
    const OUTROS_FMT1 = "m3u8";

    const OUTROS_DNS2 = "http://backup-shark.sbs"; // Coloque seu DNS 2 dos IBOs aqui
    const OUTROS_NOME2 = "Backup VIP";
    const OUTROS_FMT2 = "ts";
    // =========================================================================

    if (window.location.href.includes('omini_verify=1')) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlMac = urlParams.get('mac'); const urlKey = urlParams.get('key');
        const setNativeValue = (element, value) => {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
            if (valueSetter && valueSetter !== prototypeValueSetter) prototypeValueSetter.call(element, value); else valueSetter.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true })); element.dispatchEvent(new Event('change', { bubbles: true }));
        };
        if (urlMac) {
            let tentativas = 0;
            let timerPreenchimento = setInterval(() => {
                tentativas++; let inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
                if (inputs.length >= 2) {
                    if (inputs[0] && inputs[0].value !== urlMac) setNativeValue(inputs[0], urlMac);
                    if (inputs[1] && urlKey && inputs[1].value !== urlKey) setNativeValue(inputs[1], urlKey);
                    let btnLogin = document.querySelector('button[type="submit"], button.btn');
                    if (btnLogin && btnLogin.disabled) btnLogin.disabled = false;
                }
                if (tentativas >= 6) clearInterval(timerPreenchimento);
            }, 500);
        }
        return; 
    }

    const WORKER_MOTOR = "https://motoriboebobinjetor.lucassheiksk41.workers.dev";
    const WORKER_ESCRAVO = "https://motorescravo.lucassheiksk41.workers.dev";
    const API_2CAPTCHA = "69b731c3b84946f4171a68ea93713871";
    let roletaMemoria = { hash: "", pares: [], index: 0 };

    function criarPainelHub() {
        if (!document.body || document.getElementById('omini-wrapper')) return;
        const wrapper = document.createElement('div'); wrapper.id = 'omini-wrapper';
        wrapper.style.cssText = `position: fixed !important; top: 70px !important; right: 15px !important; z-index: 2147483647 !important; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;`;
        const painel = document.createElement('div'); painel.id = 'omini-hub-panel';
        painel.style.cssText = `width: 270px; max-width: 85vw; background: #0f172a; border: 1px solid #f97316; border-radius: 8px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.9), 0 0 10px rgba(249, 115, 22, 0.2); color: #f8fafc; display: none; transform-origin: top right;`;

        // 🛡️ ARMADURA DE TITÂNIO
        const style = document.createElement('style');
        style.innerHTML = `
            #omini-hub-panel::-webkit-scrollbar { width: 3px; } 
            #omini-hub-panel::-webkit-scrollbar-track { background: #0f172a; } 
            #omini-hub-panel::-webkit-scrollbar-thumb { background: #f97316; } 
            #omini-hub-panel input:focus { border-color: #f97316 !important; }
            #omini-hub-panel, #omini-hub-panel * { box-sizing: border-box !important; }
            #omini-hub-panel { height: auto !important; max-height: 85vh !important; }
            #omini-hub-panel div { height: auto !important; max-height: none !important; min-height: 0 !important; }
            #omini-hub-panel input, #omini-hub-panel select, #omini-hub-panel button {
                height: 26px !important; max-height: 26px !important; min-height: 26px !important;
                padding: 0 6px !important; margin: 0 !important; line-height: normal !important; outline: none !important;
            }
            #hub-btn-injetar { height: 30px !important; max-height: 30px !important; min-height: 30px !important; }
            #hub-header { height: auto !important; min-height: 0 !important; max-height: none !important; padding: 4px !important; }
        `;
        document.head.appendChild(style);

        painel.innerHTML = `
            <div id="hub-header" style="background: linear-gradient(90deg, #2e1065, #6b21a8); font-weight: 900; font-size: 11px; border-radius: 7px 7px 0 0; text-align: center; color: #f97316; text-shadow: 0 0 5px #f97316;">
                <span>🚀 ROCKET HUB v6.2 (ARMADURA)</span>
            </div>
            <div id="hub-body" style="padding: 6px; display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; gap: 4px; align-items: center;">
                    <select id="hub-app" style="flex: 1; background: #1e293b; color: #fff; border: 1px solid #334155; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 10px;">
                        <option value="BOB">🟣 Bob Player</option>
                        <option value="IBO">🟢 Ibo Player</option>
                        <option value="IBOPRO">🔴 IBO Pro</option>
                        <option value="SMART">🔵 Smart One</option>
                    </select>
                    <button id="hub-btn-capturar" style="background: transparent; color: #c084fc; border: 1px solid #c084fc; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 10px;">🎯 Puxar</button>
                    <button id="hub-btn-verificar" style="background: transparent; color: #00f6ff; border: 1px solid #00f6ff; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 10px;">👀 Ver</button>
                </div>
                <div style="display: flex; gap: 4px; align-items: center;">
                    <input type="text" id="hub-mac" placeholder="MAC" style="flex: 2; background: #020617; color: #f97316; border: 1px solid #6b21a8; border-radius: 4px; font-size: 10px;">
                    <input type="text" id="hub-key" placeholder="Key" style="flex: 1; background: #020617; color: #f97316; border: 1px solid #6b21a8; border-radius: 4px; font-size: 10px;">
                </div>
                <div style="display: flex; gap: 4px; align-items: center;">
                    <input type="text" id="hub-user" placeholder="Usuário" style="flex: 1; background: #020617; color: #f59e0b; border: 1px solid #6b21a8; border-radius: 4px; font-size: 10px;">
                    <input type="text" id="hub-pass" placeholder="Senha" style="flex: 1; background: #020617; color: #f59e0b; border: 1px solid #6b21a8; border-radius: 4px; font-size: 10px;">
                </div>
                <div style="border-left: 2px solid #f97316; padding-left: 4px;">
                    <input type="text" id="hub-dns1" placeholder="URL DNS 1" style="width: 100%; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 4px; font-size: 10px; margin-bottom: 3px !important;">
                    <div style="display: flex; gap: 3px; align-items: center;">
                        <input type="text" id="hub-nome1" style="flex: 2; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 4px; font-size: 10px;">
                        <input type="text" id="hub-fmt1" style="flex: 1; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 4px; font-size: 10px;">
                    </div>
                </div>
                <div id="hub-box-dns2" style="display: none; border-left: 2px solid #c084fc; padding-left: 4px;">
                    <input type="text" id="hub-dns2" placeholder="URL DNS 2" style="width: 100%; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 4px; font-size: 10px; margin-bottom: 3px !important;">
                    <div style="display: flex; gap: 3px; align-items: center;">
                        <input type="text" id="hub-nome2" style="flex: 2; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 4px; font-size: 10px;">
                        <input type="text" id="hub-fmt2" style="flex: 1; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 4px; font-size: 10px;">
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: #020617; padding: 4px 6px; border-radius: 4px; border: 1px solid #1e3a8a;">
                    <label style="font-size: 9px; color: #94a3b8; cursor: pointer; display: flex; align-items: center; height: auto !important;"><input type="checkbox" id="hub-chk-dns2" style="margin: 0 4px 0 0 !important; height: auto !important; min-height: 0 !important;"> + DNS 2</label>
                    <label style="font-size: 9px; color: #fca5a5; cursor: pointer; display: flex; align-items: center; height: auto !important;"><input type="checkbox" id="hub-chk-apagar" style="accent-color: #ef4444; margin: 0 4px 0 0 !important; height: auto !important; min-height: 0 !important;"> 🗑️ Apagar Listas</label>
                </div>
                <button id="hub-btn-injetar" style="width: 100%; background: linear-gradient(135deg, #4c1d95, #7e22ce); color: #f97316; border: 1px solid #f97316; box-shadow: 0 0 10px rgba(249, 115, 22, 0.4); border-radius: 4px; font-weight: 900; letter-spacing: 0.5px; cursor: pointer; font-size: 11px; margin-top: 2px !important;">🚀 INJETAR</button>
                <div id="hub-cloud-dados" style="font-size: 9px; color: #94a3b8; text-align: center; margin-top: 2px !important; min-height: 12px !important; height: auto !important; line-height: 1.2 !important;"><i>Pronto para iniciar.</i></div>
            </div>
        `;

        const bolha = document.createElement('div'); bolha.id = 'omini-hub-bolha';
        bolha.style.cssText = `width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #2e1065, #6b21a8); display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 0 15px rgba(249, 115, 22, 0.6), inset 0 0 8px rgba(249, 115, 22, 0.4); border: 2px solid #f97316; user-select: none;`;
        bolha.innerHTML = `<span style="font-size: 20px; filter: drop-shadow(0 0 6px #f97316);">🚀</span>`;
        bolha.onclick = () => {
            if (painel.style.display === 'none') { painel.style.display = 'block'; bolha.innerHTML = `❌`; bolha.style.background = `linear-gradient(135deg, #450a0a, #991b1b)`; bolha.style.borderColor = `#ff0055`;
            } else { painel.style.display = 'none'; bolha.innerHTML = `🚀`; bolha.style.background = `linear-gradient(135deg, #2e1065, #6b21a8)`; bolha.style.borderColor = `#f97316`; }
        };
        wrapper.appendChild(bolha); wrapper.appendChild(painel); document.body.appendChild(wrapper);

        document.getElementById('hub-btn-verificar').onclick = () => {
            const app = document.getElementById('hub-app').value; const mac = document.getElementById('hub-mac').value.trim(); const key = document.getElementById('hub-key').value.trim();
            if (!mac) return alert("Puxe um MAC primeiro!");
            if (app === 'BOB') window.open(`https://bobplayer.com/device/login?mac=${mac}&key=${key}&omini_verify=1`, '_blank');
            else if (app === 'IBO') window.open(`https://iboplayer.com/device/login?mac=${mac}&key=${key}&omini_verify=1`, '_blank');
            else if (app === 'IBOPRO') window.open(`https://iboproapp.com/manage-playlists/login/?mac=${mac}&key=${key}&omini_verify=1`, '_blank');
        };

        document.getElementById('hub-chk-dns2').onchange = (e) => { document.getElementById('hub-box-dns2').style.display = e.target.checked ? 'block' : 'none'; GM_setValue('hub_dns2_ativo', e.target.checked); };

        try {
            document.getElementById('hub-chk-apagar').checked = GM_getValue('hub_apagar', false);
            
            // 🧠 PREENCHIMENTO DUPLO (DNS 1 e DNS 2)
            const aplicarPadrao = (appMode) => {
                if (appMode === 'BOB') { 
                    document.getElementById('hub-dns1').value = BOB_DNS1; document.getElementById('hub-nome1').value = BOB_NOME1; document.getElementById('hub-fmt1').value = BOB_FMT1; 
                    document.getElementById('hub-dns2').value = BOB_DNS2; document.getElementById('hub-nome2').value = BOB_NOME2; document.getElementById('hub-fmt2').value = BOB_FMT2; 
                } else { 
                    document.getElementById('hub-dns1').value = OUTROS_DNS1; document.getElementById('hub-nome1').value = OUTROS_NOME1; document.getElementById('hub-fmt1').value = OUTROS_FMT1; 
                    document.getElementById('hub-dns2').value = OUTROS_DNS2; document.getElementById('hub-nome2').value = OUTROS_NOME2; document.getElementById('hub-fmt2').value = OUTROS_FMT2; 
                }
            };
            
            let appSalvo = GM_getValue('hub_last_app', 'BOB'); 
            document.getElementById('hub-app').value = appSalvo; 
            aplicarPadrao(appSalvo);
            
            document.getElementById('hub-app').addEventListener('change', (e) => { aplicarPadrao(e.target.value); });
            
            if(GM_getValue('hub_dns2_ativo', false)) { document.getElementById('hub-chk-dns2').checked = true; document.getElementById('hub-box-dns2').style.display = 'block'; }
        } catch(e) {}

        document.getElementById('hub-btn-capturar').onclick = () => {
            const status = document.getElementById('hub-cloud-dados'); const appSelecionado = document.getElementById('hub-app').value;
            status.innerHTML = `<i style="color:#f97316;">Analisando tela...</i>`;
            document.getElementById('hub-mac').value = ''; document.getElementById('hub-key').value = ''; document.getElementById('hub-user').value = ''; document.getElementById('hub-pass').value = '';
            let todosElementos = document.querySelectorAll('label, div, span');
            todosElementos.forEach(el => {
                let txt = el.innerText ? el.innerText.trim().toLowerCase() : '';
                if (txt === 'usuário' || txt === 'usuário *' || txt === 'usuario') { let p = el.parentElement; let inp = p.querySelector('input:not([id^="hub-"])') || (p.parentElement ? p.parentElement.querySelector('input:not([id^="hub-"])') : null); if (inp && inp.value) document.getElementById('hub-user').value = inp.value; }
                if (txt === 'senha' || txt === 'senha *') { let p = el.parentElement; let inp = p.querySelector('input:not([id^="hub-"])') || (p.parentElement ? p.parentElement.querySelector('input:not([id^="hub-"])') : null); if (inp && inp.value) document.getElementById('hub-pass').value = inp.value; }
            });
            if (!document.getElementById('hub-user').value) { let u = document.querySelector('input[name="username"], input[name*="user"]:not([id^="hub-"])'); if(u) document.getElementById('hub-user').value = u.value; }
            if (!document.getElementById('hub-pass').value) { let p = document.querySelector('input[name="password"], input[name*="pass"]:not([id^="hub-"])'); if(p) document.getElementById('hub-pass').value = p.value; }
            let textoAlvo = (window.getSelection().toString() + " \n" + Array.from(document.querySelectorAll('textarea:not([id^="hub-"]), input[type="text"]:not([id^="hub-"])')).map(t => t.value).join(' \n') + " \n" + Array.from(document.querySelectorAll('[contenteditable="true"]:not([id^="hub-"])')).map(e => e.innerText).join(' \n')).replace(/o/gi, '0').replace(/,/g, ' ').split(/[\s\n\r]+/).filter(p => p.split(':').length <= 6).join(' ');
            let paresEncontrados = []; let macRegex = /\b(?:[a-fA-F0-9][:\-]?){11}[a-fA-F0-9]\b/gi; let m;
            while ((m = macRegex.exec(textoAlvo)) !== null) {
                let macL = m[0].replace(/[^a-fA-F0-9]/gi, '').toLowerCase().match(/.{1,2}/g).join(':'); let end = m.index + m[0].length + 80;
                let keyMatch = textoAlvo.substring(m.index + m[0].length, end).match(/\b\d{6}\b/);
                if (appSelecionado === 'SMART') { if (!keyMatch) paresEncontrados.push({ mac: macL, key: "" }); } else { if (keyMatch) paresEncontrados.push({ mac: macL, key: keyMatch[0] }); }
            }
            let paresUnicos = []; let vistos = new Set();
            for (let p of paresEncontrados) { let comboId = p.mac + "-" + p.key; if (!vistos.has(comboId)) { vistos.add(comboId); paresUnicos.push(p); } }
            if (paresUnicos.length > 0) {
                let hashAtual = paresUnicos.map(p => p.mac + p.key).join("|");
                if (hashAtual === roletaMemoria.hash) { roletaMemoria.index = (roletaMemoria.index + 1) % paresUnicos.length; } else { roletaMemoria.hash = hashAtual; roletaMemoria.pares = paresUnicos; roletaMemoria.index = 0; }
            } else { if (roletaMemoria.pares.length > 0) { roletaMemoria.index = (roletaMemoria.index + 1) % roletaMemoria.pares.length; } else { status.innerHTML = "<span style='color:#ef4444;'>⚠️ Nenhum MAC!</span>"; return; } }
            document.getElementById('hub-mac').value = roletaMemoria.pares[roletaMemoria.index].mac; document.getElementById('hub-key').value = roletaMemoria.pares[roletaMemoria.index].key;
            if (!document.getElementById('hub-user').value) { let mx = textoAlvo.match(/(?:usu[aá]rio|user|username)\s*[:\-]?\s*([^\s]+)/i); if(mx) document.getElementById('hub-user').value = mx[1]; }
            if (!document.getElementById('hub-pass').value) { let mx = textoAlvo.match(/(?:senha|pass|password)\s*[:\-]?\s*([^\s]+)/i); if(mx) document.getElementById('hub-pass').value = mx[1]; }
            status.innerHTML = roletaMemoria.pares.length > 1 ? `<b style="color:#f97316;">✅ Opção ${roletaMemoria.index + 1} de ${roletaMemoria.pares.length}</b>` : `<b style="color:#10b981;">✅ Única dupla capturada!</b>`;
        };

        document.getElementById('hub-btn-injetar').onclick = async () => {
            const app = document.getElementById('hub-app').value; const mac = document.getElementById('hub-mac').value.trim(); const key = document.getElementById('hub-key').value.trim();
            const user = document.getElementById('hub-user').value.trim(); const pass = document.getElementById('hub-pass').value.trim(); const dns1 = document.getElementById('hub-dns1').value.trim(); const apagarTudo = document.getElementById('hub-chk-apagar').checked;
            if(!mac || !user || !pass || !dns1) return alert("Preencha MAC, Usuário, Senha e DNS 1!");
            const statusEl = document.getElementById('hub-cloud-dados'); const btn = document.getElementById('hub-btn-injetar');
            try { GM_setValue('hub_apagar', apagarTudo); GM_setValue('hub_last_app', app); GM_setValue('hub_dns2', document.getElementById('hub-dns2').value); } catch(e) {}
            if (app === 'SMART') { statusEl.innerHTML = "<b style='color:#f97316;'>⏳ Robô do Smart...</b>"; setTimeout(() => statusEl.innerHTML = "<i>Pronto.</i>", 4000); return; }
            if (app === 'IBOPRO') {
                btn.disabled = true; statusEl.innerHTML = "<b style='color:#00f6ff;'>📡 Enviando...</b>";
                const payloadEscravo = { mac: mac, key: key, user: user, pass: pass, dns1: btoa(dns1), nome1: btoa(document.getElementById('hub-nome1').value), dns2: btoa(document.getElementById('hub-chk-dns2').checked ? document.getElementById('hub-dns2').value : ''), nome2: btoa(document.getElementById('hub-chk-dns2').checked ? document.getElementById('hub-nome2').value : ''), apagar: apagarTudo ? '1' : '0' };
                try {
                    await fetch(`${WORKER_ESCRAVO}/add-fila`, { method: 'POST', body: JSON.stringify(payloadEscravo) });
                    statusEl.innerHTML = "<b style='color:#f97316;'>⏳ Aguardando...</b>"; await new Promise(r => setTimeout(r, 5500));
                    let resStatus = await (await fetch(`${WORKER_ESCRAVO}/get-last-status`)).json();
                    statusEl.innerHTML = (resStatus.status && resStatus.status.includes("NA FILA")) ? "<b style='color:#ef4444;'>⚠️ Escravo OFF!</b>" : "<b style='color:#10b981;'>✅ Escravo Assumiu!</b>";
                } catch (e) { statusEl.innerHTML = "<span style='color:#ef4444;'>⚠️ Nuvem offline!</span>"; }
                setTimeout(() => { btn.disabled = false; statusEl.innerHTML = "<i>Pronto.</i>"; }, 5000); return;
            }
            btn.disabled = true; statusEl.innerHTML = "<b style='color:#f97316;'>🔄 Baixando (5 Captchas Pentakill)...</b>";
            try {
                let promises = []; for(let i=0; i<5; i++){ promises.push(fetch(`${WORKER_MOTOR}/get-captcha?app=${app}`).then(r => r.json())); }
                let resCaps = await Promise.all(promises); let captchas_gerados = [];
                for(let resCap of resCaps) { if(resCap.status === 'ok' && resCap.svg) { let base64 = await svgToBase64(resCap.svg, app); captchas_gerados.push({ base64: base64, token: resCap.token, cookie: resCap.cap_cookie }); } }
                if(captchas_gerados.length === 0) throw new Error("Falha na geração.");
                const payload = { app: app, mac: mac, key: key, user: user, pass: pass, apikey: API_2CAPTCHA, captchas: captchas_gerados, apagar_antigas: apagarTudo, srv1_ativo: true, srv1_dns: dns1, srv1_fmt: document.getElementById('hub-fmt1').value, srv1_nome: document.getElementById('hub-nome1').value, srv2_ativo: document.getElementById('hub-chk-dns2').checked, srv2_dns: document.getElementById('hub-dns2').value, srv2_fmt: document.getElementById('hub-fmt2').value, srv2_nome: document.getElementById('hub-nome2').value };
                await fetch(`${WORKER_MOTOR}/execute-background`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                statusEl.innerHTML = "<b style='color:#10b981;'>💣 Pentakill Nuvem! PODE FECHAR!</b>"; btn.innerText = "✅ ENVIADO";
            } catch(e) { statusEl.innerHTML = `<span style='color:#ef4444;'>❌ Falha</span>`; btn.innerText = "❌ FALHOU"; }
            setTimeout(() => { btn.disabled = false; btn.innerText = "🚀 INJETAR"; }, 4000);
        };

        function svgToBase64(svgString, appMode) {
           return new Promise((resolve) => {
               try {
                   const div = document.createElement('div'); div.innerHTML = svgString.trim(); const svg = div.querySelector('svg');
                   if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); if (!svg.getAttribute('width')) svg.setAttribute('width', '150'); if (!svg.getAttribute('height')) svg.setAttribute('height', '50');
                   const b64 = btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg)))); const url = 'data:image/svg+xml;base64,' + b64; const img = new Image();
                   img.onload = () => {
                       const canvas = document.createElement('canvas'); canvas.width = 150; canvas.height = 50; const ctx = canvas.getContext('2d');
                       ctx.fillStyle = (appMode === 'BOB') ? '#0f172a' : '#FFFFFF'; ctx.fillRect(0,0,150,50); ctx.drawImage(img,0,0,150,50); URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
                   }; img.onerror = () => resolve(b64); img.src = url;
               } catch(e) { resolve(null); }
           });
        }
        async function checarNuvem() {
            const appSel = document.getElementById('hub-app').value; const workerBase = appSel === 'IBOPRO' ? WORKER_ESCRAVO : WORKER_MOTOR;
            try {
                const req = await fetch(workerBase + '/get-last-status'); const res = await req.json(); const painelDados = document.getElementById('hub-cloud-dados');
                if (res.msg) { let corStatus = res.status && res.status.includes('❌') ? '#ef4444' : '#10b981'; if (res.status && (res.status.includes('⏳') || res.status.includes('🚀'))) corStatus = '#f97316'; painelDados.innerHTML = `<span style="color:${corStatus}; font-weight:bold;">${res.status || ''}</span> <span style="color:#94a3b8;">- ${res.msg}</span>`; }
            } catch(e) { }
        }
        setInterval(checarNuvem, 1500); setTimeout(checarNuvem, 500);
    }
    setInterval(() => { if (!document.getElementById('omini-wrapper')) criarPainelHub(); }, 1000);
})();
