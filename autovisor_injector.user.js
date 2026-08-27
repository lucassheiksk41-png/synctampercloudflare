// ==UserScript==
// @name         OMINI AUTO-VISOR (Bob e Ibo Player)
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Busca Inteligente + Bypass React Nativo + Sync GitHub!
// @author       Você & Omini
// @match        *://*.bobplayer.com/*
// @match        *://bobplayer.com/*
// @match        *://*.iboplayer.com/*
// @match        *://iboplayer.com/*
// @updateURL    https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/autovisor_injector.user.js
// @downloadURL  https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/autovisor_injector.user.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      api.2captcha.com
// ==/UserScript==

(function() {
    'use strict';

    console.log("👀 OMINI VISOR: Aba detectada (v2.8 - Bypass React & Sync GitHub)!");

    const API_2CAPTCHA = "69b731c3b84946f4171a68ea93713871";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('omini_verify') === '1') sessionStorage.setItem('omini_visor_ativo', 'true');
    if (sessionStorage.getItem('omini_visor_ativo') !== 'true') return;

    // =========================================================================
    // Digitação Robótica Feroz (Bypass Nativo React Nível Máximo)
    // =========================================================================
    function typeLikeHuman(el, text) {
        if (!el) return;
        el.focus();
        
        const valueSetter = Object.getOwnPropertyDescriptor(el, 'value')?.set;
        const prototype = Object.getPrototypeOf(el);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(el, text);
        } else if (prototypeValueSetter) {
            prototypeValueSetter.call(el, text);
        } else {
            el.value = text;
        }
        
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.blur();
    }

    // A MIRA LASER INTELIGENTE: Pega o SVG mais complexo da tela (ignora a setinha de refresh!)
    function encontrarCaptchaExato() {
        let svgs = Array.from(document.querySelectorAll('svg'));
        // Ignora logotipos no topo da página
        svgs = svgs.filter(s => s.getBoundingClientRect().top > 50);
        if (svgs.length === 0) return null;

        // O Captcha verdadeiro é o desenho com mais "paths" (linhas/curvas) dentro dele.
        // Ícones de refresh ou botões têm 1 ou 2 paths. O Captcha tem dezenas.
        svgs.sort((a, b) => b.querySelectorAll('path').length - a.querySelectorAll('path').length);

        return svgs[0];
    }

    function iniciarVisor() {
        if (!document.body) { setTimeout(iniciarVisor, 200); return; }

        if (window.location.href.includes('/login') || document.querySelector('input[name*="mac" i], input[type="text"]')) {
            let mac = urlParams.get('mac') || sessionStorage.getItem('omini_mac');
            let key = urlParams.get('key') || sessionStorage.getItem('omini_key');

            if (mac) {
                sessionStorage.setItem('omini_mac', mac); sessionStorage.setItem('omini_key', key);

                let overlay = document.createElement('div');
                overlay.id = "omini-overlay-visor";
                overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#00f6ff; font-family:sans-serif; text-align:center; backdrop-filter: blur(3px);";
                overlay.innerHTML = `<div style="font-size: 50px; margin-bottom: 20px;">👀</div><div style="font-size: 24px; font-weight: bold; color: #f97316;">VISOR ATIVADO</div><div id="visor-status" style="font-size: 16px; margin-top: 10px; color: #94a3b8;">Focando no Captcha Real e enviando à Índia...</div>`;
                document.body.appendChild(overlay);

                setTimeout(async () => {
                    let acceptBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText && b.innerText.toUpperCase().includes('ACCEPT'));
                    if (acceptBtn) acceptBtn.click();

                    let svg = encontrarCaptchaExato();

                    if (svg) {
                        // PREPARAÇÃO PARA FICAR IGUAL AO INJETOR NUVEM:
                        let clone = svg.cloneNode(true);
                        clone.removeAttribute('width');   // Limpa a largura para não bugar
                        clone.removeAttribute('height');  // Limpa a altura para não bugar
                        clone.removeAttribute('style');   // Limpa CSS da tela

                        let base64 = await svgToBase64(clone.outerHTML);
                        document.getElementById('visor-status').innerHTML = "<b style='color:#f97316;'>Buscando senha (Corrida de 5 Indianos)... ⏳</b>";

                        let senha = await solveCaptchaQuintuplo(base64, API_2CAPTCHA);

                        if (senha) {
                            document.getElementById('visor-status').innerHTML = `<span style="color:#10b981; font-weight:bold;">Senha [${senha}] recebida! Injetando tudo na velocidade da luz... 🚀</span>`;

                            let inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"])'));
                            let mInp = inputs.find(i => (i.name||"").toLowerCase().includes('mac') || (i.placeholder||"").toLowerCase().includes('mac')) || inputs[0];
                            let kInp = inputs.find(i => (i.name||"").toLowerCase().includes('key') || (i.name||"").toLowerCase().includes('device') || (i.placeholder||"").toLowerCase().includes('key')) || inputs[1];
                            let cInp = inputs.find(i => (i.name||"").toLowerCase().includes('captcha') || (i.placeholder||"").toLowerCase().includes('captcha')) || inputs[2];

                            typeLikeHuman(mInp, mac);
                            typeLikeHuman(kInp, key);
                            typeLikeHuman(cInp, senha);

                            setTimeout(() => {
                                let loginBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.toUpperCase().includes('LOGIN')) || document.querySelector('button[type="submit"]');
                                if(loginBtn) {
                                    loginBtn.disabled = false; // Força ativação caso o React teime
                                    loginBtn.click();
                                }

                                setTimeout(() => { if(document.getElementById("omini-overlay-visor")) document.getElementById("omini-overlay-visor").remove(); }, 1500);
                            }, 400);
                        } else {
                            document.getElementById('visor-status').innerHTML = "<span style='color:#ef4444;'>❌ Imagem ilegível ou respostas falsas. Pressione F5 para tentar novamente!</span>";
                        }
                    } else {
                        document.getElementById('visor-status').innerHTML = "<span style='color:#ef4444;'>❌ Captcha não encontrado na tela.</span>";
                        setTimeout(() => { if(document.getElementById("omini-overlay-visor")) document.getElementById("omini-overlay-visor").remove(); }, 3000);
                    }
                }, 800);
            }
        } else {
            // TELA DO PAINEL LOGADO
            setTimeout(() => {
                const btnFechar = document.createElement('button');
                btnFechar.innerHTML = `✅ ESTÁ TUDO CERTO! (Fechar Aba)`;
                btnFechar.style.cssText = `position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #059669, #10b981); color: white; border: 2px solid #34d399; border-radius: 12px; padding: 15px 30px; font-size: 18px; font-weight: 900; cursor: pointer; z-index: 9999999; box-shadow: 0 10px 25px rgba(0,0,0,0.9); text-transform: uppercase; font-family: 'Arial Black', sans-serif; transition: 0.2s;`;
                btnFechar.onclick = () => { sessionStorage.removeItem('omini_visor_ativo'); window.close(); };
                document.body.appendChild(btnFechar);
            }, 1500);
        }
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', iniciarVisor); } else { iniciarVisor(); }

    // ==========================================
    // CLONE ABSOLUTO DO INJETOR NUVEM (v5.5)
    // ==========================================
    function svgToBase64(svgString) {
        return new Promise((resolve) => {
            try {
                const div = document.createElement('div'); div.innerHTML = svgString.trim(); const svg = div.querySelector('svg');
                if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                if (!svg.getAttribute('width')) svg.setAttribute('width', '150'); if (!svg.getAttribute('height')) svg.setAttribute('height', '50');
                const b64 = btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))));
                const url = 'data:image/svg+xml;base64,' + b64; const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas'); canvas.width = 150; canvas.height = 50;
                    const ctx = canvas.getContext('2d');
                    // Fundo escuro universal do Injetor Nuvem
                    ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,150,50); ctx.drawImage(img,0,0,150,50);
                    URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
                }; img.onerror = () => resolve(b64); img.src = url;
            } catch(e) { resolve(null); }
        });
    }

    function solveCaptchaQuintuplo(base64, apikey) {
        return new Promise((resolveMain) => {
            let resolvido = false;

            function contratarUmIndiano() {
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "POST", url: "https://api.2captcha.com/createTask", headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({ clientKey: apikey, task: { type: "ImageToTextTask", body: base64 } }),
                        onload: function(res) {
                            try {
                                let resIn = JSON.parse(res.responseText); if (resIn.errorId !== 0) return resolve(null);
                                let taskId = resIn.taskId; let tentativas = 0;

                                let checkInterval = setInterval(() => {
                                    if (resolvido) { clearInterval(checkInterval); return resolve(null); }
                                    tentativas++; if (tentativas > 15) { clearInterval(checkInterval); return resolve(null); }

                                    GM_xmlhttpRequest({
                                        method: "POST", url: "https://api.2captcha.com/getTaskResult", headers: { "Content-Type": "application/json" },
                                        data: JSON.stringify({ clientKey: apikey, taskId: taskId }),
                                        onload: function(resRes) {
                                            try {
                                                let jsonRes = JSON.parse(resRes.responseText);
                                                if (jsonRes.status === 'ready') {
                                                    clearInterval(checkInterval);
                                                    let resposta = jsonRes.solution.text.toUpperCase().trim();

                                                    // Filtro contra respostas burras
                                                    if (resposta.match(/^A+$/) || resposta === "111" || resposta === "123" || (resposta.length === 1 && isNaN(resposta))) {
                                                        resolve(null);
                                                    } else {
                                                        resolve(resposta);
                                                    }
                                                }
                                            } catch(e) {}
                                        }
                                    });
                                }, 1500);
                            } catch(e) { resolve(null); }
                        }, onerror: () => resolve(null)
                    });
                });
            }

            let corrida = [contratarUmIndiano(), contratarUmIndiano(), contratarUmIndiano(), contratarUmIndiano(), contratarUmIndiano()];
            let terminados = 0;
            corrida.forEach(trabalhador => {
                trabalhador.then(senha => {
                    if (senha && !resolvido) {
                        resolvido = true;
                        resolveMain(senha);
                    } else {
                        terminados++;
                        if (terminados === 5 && !resolvido) resolveMain(null);
                    }
                });
            });
        });
    }
})();
