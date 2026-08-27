// ==UserScript==
// @name         OMINI SNIPER | IBO Pro App (Motor Escravo)
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  Descriptografa Base64 antes de injetar + Sincronização Automática via GitHub
// @author       Você & Omini
// @match        *://*.iboproapp.com/*
// @updateURL    https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/escravo_ibo_injector.user.js
// @downloadURL  https://raw.githubusercontent.com/lucassheiksk41-png/synctampercloudflare/main/escravo_ibo_injector.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🔥 COLOQUE AQUI A URL DO SEU WORKER
    const WORKER_URL = "https://syncibo.lucassheiksk41.workers.dev";

    // =========================================================
    // 1. MODO RADAR (A PÁGINA FANTASMA /escravo)
    // =========================================================
    if (window.location.pathname.toLowerCase().includes('/escravo')) {
        document.title = "🖥️ ESCRAVO OMINI";
        document.body.style.background = "#111827";

        let pisca = false;

        setInterval(async () => {
            // CORAÇÃO PULSANTE (Evita que o navegador hiberne a aba)
            pisca = !pisca;
            document.body.innerHTML = `<h1 style='color:white; text-align:center; margin-top:20%; font-family:sans-serif;'>🖥️ MODO ESCRAVO ATIVO (v7.3)<br><br><span style='font-size:20px; color:${pisca ? '#10b981' : '#34d399'};'>Aguardando ordens pelo celular... ${pisca ? '⏳' : '⌛'}</span></h1>`;

            try {
                let req = await fetch(`${WORKER_URL}/get-fila`);
                let res = await req.json();

                if (res && res.mac) {
                    await fetch(`${WORKER_URL}/ack-fila`, { method: 'POST', body: JSON.stringify({mac: res.mac}) });
                    res.etapa = 'LOGIN';
                    sessionStorage.setItem('omini_payload', JSON.stringify(res));
                    window.location.href = "/manage-playlists/login/";
                }
            } catch(e) {}
        }, 1500); // Pergunta a cada 1.5s

        // AUTO-LIMPEZA: Dá um F5 a cada 10 minutos pra não estourar a memória RAM
        setTimeout(() => window.location.reload(), 600000);
        return;
    }

    // =========================================================
    // 2. MODO INJEÇÃO (Quando ele entra no Login e no Painel)
    // =========================================================
    const payload = JSON.parse(sessionStorage.getItem('omini_payload'));
    if (!payload) return;

    function status(msg) {
        let d = document.getElementById('omini-aviso');
        if (!d) {
            d = document.createElement('div');
            d.id = 'omini-aviso';
            d.style.cssText = "position:fixed; top:15px; right:15px; background:#10b981; color:white; padding:15px 25px; z-index:999999; font-weight:bold; border-radius:8px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 14px;";
            document.body.appendChild(d);
        }
        d.innerText = "🤖 OMINI ESCRAVO: " + msg;
    }

    // Funções Biônicas
    function getBotaoVisivel(textos, proibidos = []) {
        let els = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"], .btn')).filter(e => e.getBoundingClientRect().width > 0 && e.offsetHeight > 0);
        for (let t of textos) {
            let f = els.find(e => {
                let txt = (e.innerText || e.value || e.textContent || '').toLowerCase();
                if (!txt.includes(t.toLowerCase())) return false;
                for (let p of proibidos) { if (txt.includes(p.toLowerCase())) return false; }
                return true;
            });
            if (f) return f;
        } return null;
    }
    
    function fecharModaisDeFundo() {
        let fecharTudo = Array.from(document.querySelectorAll('button, a, span, i, .swal2-close')).filter(e => {
            let txt = (e.innerText || e.textContent || '').trim().toLowerCase();
            return ['cancel', 'cancelar', 'close', 'x', '×'].includes(txt) || (e.className||'').toLowerCase().includes('close');
        });
        fecharTudo.forEach(b => { try { b.click(); } catch(e){} });
    }
    
    function setInputValue(element, value) {
        if(!element) return;
        element.focus(); let lastValue = element.value; element.value = value;
        let event = new Event('input', { bubbles: true });
        if (element._valueTracker) element._valueTracker.setValue(lastValue);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        if(nativeInputValueSetter) nativeInputValueSetter.call(element, value);
        element.dispatchEvent(event); element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
    }
    
    function injetarPinCirurgico(btnConfirmar, pin) {
        let parent = btnConfirmar.parentElement; let pinInput = null;
        while (parent && parent.tagName !== 'BODY') {
            let inputs = Array.from(parent.querySelectorAll('input')).filter(i => i.getBoundingClientRect().width > 0 && !['hidden', 'button', 'submit'].includes((i.type||'').toLowerCase()));
            if (inputs.length > 0) { pinInput = inputs[inputs.length - 1]; break; } parent = parent.parentElement;
        }
        if (pinInput) setInputValue(pinInput, pin);
    }

    function getLixeiraAlvo() {
        let els = Array.from(document.querySelectorAll('button, a, input[type="button"], .btn, .text-danger, .fa-trash, .fe-trash')).filter(e => e.getBoundingClientRect().width > 0 && e.dataset.ignorar !== 'sim');
        let matches = [];
        for (let e of els) {
            let txt = (e.innerText || e.value || e.textContent || '').toLowerCase(); let cls = (e.className || '').toLowerCase();
            if (txt.includes('delete') || txt.includes('apagar') || txt.includes('remover') || cls.includes('trash') || cls.includes('danger')) matches.push((e.tagName === 'I' || e.tagName === 'SPAN') ? (e.closest('button, a') || e) : e);
        }
        if (matches.length === 0) return null; matches = [...new Set(matches)];

        let desNome1 = ""; try { desNome1 = atob(payload.nome1).toLowerCase(); } catch(e) { desNome1 = payload.nome1; }
        let desNome2 = ""; try { desNome2 = atob(payload.nome2).toLowerCase(); } catch(e) { desNome2 = payload.nome2; }

        if (payload.apagar === '1') return matches[0];

        for (let alvo of matches) {
            let tr = alvo.closest('tr');
            if (tr) {
                let texto = tr.innerText.toLowerCase();
                if (desNome1 && texto.includes(desNome1)) return alvo;
                if (desNome2 && texto.includes(desNome2)) return alvo;
            }
        } return null;
    }

    function iniciarFaxina(callbackTerminou) {
        let btnDelete = getLixeiraAlvo();
        if (!btnDelete) {
            setTimeout(() => { if (getLixeiraAlvo()) iniciarFaxina(callbackTerminou); else { status('Faxina: Pronta!'); callbackTerminou(); } }, 1000); return;
        }
        status('Apagando...');
        window.confirm = () => true; try { btnDelete.scrollIntoView({block: 'center'}); } catch(e){}
        btnDelete.click();
        setTimeout(() => {
            let confirmBtn = getBotaoVisivel(['ok', 'confirm', 'yes', 'sim']) || document.querySelector('.swal-button--confirm, .swal2-confirm, .btn-confirm');
            if (confirmBtn) {
                injetarPinCirurgico(confirmBtn, '1306'); confirmBtn.click();
                setTimeout(() => {
                    let btnAindaPreso = getBotaoVisivel(['ok', 'confirm', 'yes', 'sim']) || document.querySelector('.swal-button--confirm, .swal2-confirm, .btn-confirm');
                    if (btnAindaPreso) {
                        injetarPinCirurgico(btnAindaPreso, '130506'); btnAindaPreso.click();
                        setTimeout(() => {
                            let superPreso = getBotaoVisivel(['ok', 'confirm', 'yes', 'sim']) || document.querySelector('.swal-button--confirm, .swal2-confirm, .btn-confirm');
                            if (superPreso) { btnDelete.dataset.ignorar = 'sim'; fecharModaisDeFundo(); }
                            setTimeout(() => { fecharModaisDeFundo(); iniciarFaxina(callbackTerminou); }, 1000);
                        }, 1500);
                    } else { fecharModaisDeFundo(); setTimeout(() => iniciarFaxina(callbackTerminou), 1500); }
                }, 1500);
            } else { fecharModaisDeFundo(); setTimeout(() => iniciarFaxina(callbackTerminou), 1500); }
        }, 1000);
    }

    function executarFormulario(nomeServidor, urlServidor, callbackSucesso) {
        let btnAdd = getBotaoVisivel(['add playlist', 'adicionar playlist'], ['xc']); let btnSubmit = getBotaoVisivel(['submit', 'save', 'salvar']);
        if (!btnSubmit) {
            if(btnAdd) btnAdd.click(); setTimeout(() => executarFormulario(nomeServidor, urlServidor, callbackSucesso), 1000);
        } else {
            let allVisibleInputs = Array.from(document.querySelectorAll('input')).filter(i => { let t = (i.type || '').toLowerCase(); return (!['hidden', 'checkbox', 'radio', 'submit', 'button'].includes(t) && i.getBoundingClientRect().width > 0); });
            let nomeInput = allVisibleInputs.find(i => i.placeholder && i.placeholder.toLowerCase().includes('name')) || allVisibleInputs[0];
            let urlInput = allVisibleInputs.find(i => i.placeholder && i.placeholder.toLowerCase().includes('.m3u')) || allVisibleInputs[1];

            if (nomeInput) setInputValue(nomeInput, nomeServidor);
            if (urlInput) setInputValue(urlInput, urlServidor);

            let checkbox = document.querySelector('input[type="checkbox"]'); if (checkbox && !checkbox.checked) checkbox.click();
            setTimeout(() => {
                let inputsFinais = Array.from(document.querySelectorAll('input')).filter(i => { let t = (i.type || '').toLowerCase(); return (!['hidden', 'checkbox', 'radio', 'submit', 'button'].includes(t) && i.getBoundingClientRect().width > 0); });
                let emptyInputs = inputsFinais.filter(i => !i.value);
                if (emptyInputs.length >= 2) { setInputValue(emptyInputs[0], '1306'); setInputValue(emptyInputs[1], '1306'); }
                setTimeout(() => { btnSubmit.click(); setTimeout(callbackSucesso, 1500); }, 1000);
            }, 800);
        }
    }

    function rodarMotor() {
        const url = window.location.href;

        if (!url.includes('/login') && payload.etapa === 'LOGIN') {
            status('Limpando sessão presa...');
            try { window.localStorage.clear(); document.cookie.split(';').forEach(c => document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')); } catch(e) {}
            let btnLogout = getBotaoVisivel(['logout', 'sair']) || document.querySelector('a[href*="logout"]');
            if (btnLogout) btnLogout.click(); else window.location.href = 'https://iboproapp.com/manage-playlists/login/';
            return;
        }

        if (url.includes('/login') && payload.etapa === 'LOGIN') {
            let allInputs = Array.from(document.querySelectorAll('input')).filter(i => !['hidden', 'checkbox', 'radio', 'submit', 'button'].includes((i.type || '').toLowerCase()));
            if(allInputs.length >= 2) {
                status('Fazendo Login...');
                setInputValue(allInputs[0], payload.mac); setInputValue(allInputs[1], payload.key);
                setTimeout(() => {
                    let btnLogin = document.querySelector('button[type="submit"]') || getBotaoVisivel(['login', 'submit']);
                    if(btnLogin) { payload.etapa = 'PAINEL'; sessionStorage.setItem('omini_payload', JSON.stringify(payload)); btnLogin.removeAttribute('disabled'); btnLogin.click(); }
                }, 1000);
            }
        }

        else if (!url.includes('/login') && payload.etapa === 'PAINEL') {
            status('Aguardando painel...');
            payload.etapa = 'EXECUTANDO'; sessionStorage.setItem('omini_payload', JSON.stringify(payload));
            let tentativas = 0;
            let verificador = setInterval(() => {
                tentativas++; let temTabela = document.querySelector('table tbody tr'); let temAddBtn = getBotaoVisivel(['add playlist', 'adicionar playlist', 'add'], ['xc']);
                if (temTabela || temAddBtn || tentativas > 20) {
                    clearInterval(verificador);
                    iniciarFaxina(() => {

                        // 🟢 DESCRIPTOGRAFANDO OS DADOS AQUI ANTES DE MONTAR O LINK 🟢
                        let dns1_dec = ""; let nome1_dec = "";
                        try { dns1_dec = atob(payload.dns1); nome1_dec = atob(payload.nome1); } catch(e) { dns1_dec = payload.dns1; nome1_dec = payload.nome1; }

                        let m3u1 = `${dns1_dec.endsWith('/') ? dns1_dec.slice(0, -1) : dns1_dec}/get.php?username=${payload.user}&password=${payload.pass}&type=m3u_plus&output=m3u8`;

                        executarFormulario(nome1_dec, m3u1, () => {
                            if (payload.dns2) {
                                let dns2_dec = ""; let nome2_dec = "";
                                try { dns2_dec = atob(payload.dns2); nome2_dec = atob(payload.nome2); } catch(e) { dns2_dec = payload.dns2; nome2_dec = payload.nome2; }

                                let m3u2 = `${dns2_dec.endsWith('/') ? dns2_dec.slice(0, -1) : dns2_dec}/get.php?username=${payload.user}&password=${payload.pass}&type=m3u_plus&output=ts`;
                                executarFormulario(nome2_dec, m3u2, finalizar);
                            } else finalizar();
                        });
                    });
                }
            }, 500);
        }
    }

    function finalizar() {
        status('✅ FINALIZADO! Avisando a nuvem...');
        fetch(`${WORKER_URL}/complete-fila`, { method: 'POST', body: JSON.stringify({mac: payload.mac}) }).then(() => {
            sessionStorage.removeItem('omini_payload');
            let btnLogout = getBotaoVisivel(['logout', 'sair']) || document.querySelector('a[href*="logout"]');
            if (btnLogout) btnLogout.click();
            setTimeout(() => window.location.href = '/escravo', 1500);
        });
    }

    setInterval(() => {
        const atual = JSON.parse(sessionStorage.getItem('omini_payload'));
        if (atual && (atual.etapa === 'LOGIN' || atual.etapa === 'PAINEL')) rodarMotor();
    }, 2000);

})();
