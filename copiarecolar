// ==UserScript==
// @name         SYNC MASTER - P2PLAYER
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bolha M Neon + Botão Sniper Integrado (Nativo)
// @author       Você & Omini
// @match        *://painel.p2player.top/*
// @match        *://*.p2player.top/*
// @match        *://*.p2-player.com/*
// @match        *://p2-player.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 🎯 O SEU NOVO WORKER DO P2 PLAYER JÁ ESTÁ AQUI:
    const LINK_WORKER_P2 = 'https://syncp2master.lucassheiksk41.workers.dev';

    console.log("🔮 ROCKET SYNC: Script P2 (v2.0 - Sniper Nativo + Bolha) ativado...");

    // ==============================================================
    // 1. O MOTOR DE EXTRAÇÃO ORIGINAL (Usado pela Bolha M na Edição)
    // ==============================================================
    function extrairDadosDaPagina() {
        let txt = document.body.innerText;
        function extrair(r){ let m = txt.match(r); return m ? m[1].trim() : ''; }
        
        let usuario = ''; let senha = ''; let expiracaoRaw = ''; 
        let comentario = ''; let expFormatada = ''; 
        
        let allInputs = Array.from(document.querySelectorAll('input'));
        
        let camposPreenchidos = allInputs.filter(i => 
            i.type !== 'hidden' && i.type !== 'button' && i.type !== 'checkbox' && i.type !== 'search' &&
            i.value && i.value.trim().length >= 2 && 
            (!i.placeholder || !i.placeholder.toLowerCase().includes('pesquisa')) &&
            !i.value.toLowerCase().includes('concordo') && 
            !i.value.toLowerCase().includes('cancelar')
        );
        
        let iptUser = camposPreenchidos.find(i => !i.value.trim().includes(' ') && !i.value.includes('/'));
        let iptSenha = camposPreenchidos.find(i => i !== iptUser && !i.value.trim().includes(' ') && !i.value.includes('/'));
        
        usuario = iptUser ? iptUser.value.trim() : (extrair(/Usuário\s*\*?\s*\n*\s*([^\n]+)/i) || '');
        senha = iptSenha ? iptSenha.value.trim() : (extrair(/Senha\s*\n*\s*([^\n]+)/i) || '123456');
        
        let dateInput = allInputs.find(i => i.value && (i.value.match(/\d{2}\/\d{2}\/\d{4}/) || i.value.match(/\d{4}-\d{2}-\d{2}/)));
        expiracaoRaw = dateInput ? dateInput.value : '';
        if (!expiracaoRaw) {
          let expMatch = txt.match(/(\d{2}\/\d{2}\/\d{4})/g);
          expiracaoRaw = expMatch ? expMatch[expMatch.length - 1] : '';
        }
        
        let textareas = Array.from(document.querySelectorAll('textarea'));
        comentario = textareas.length > 0 ? textareas[textareas.length - 1].value : '';
        if (!comentario || comentario.toLowerCase().includes('cancelar')) comentario = 'P2 Player';
        
        if (expiracaoRaw) {
          let p = expiracaoRaw.includes('/') ? expiracaoRaw.split(' ')[0].split('/') : expiracaoRaw.split(' ')[0].split('-');
          if(p.length === 3) {
            let ano, mes, dia;
            if(p[0].length === 4) { ano=p[0]; mes=p[1]; dia=p[2]; } else { dia=p[0]; mes=p[1]; ano=p[2]; }
            let d = new Date(ano, mes-1, parseInt(dia) + 1);
            expFormatada = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
          }
        }

        return { usuario, senha, expFormatada, comentario };
    }

    // ==============================================================
    // 2. A INTERFACE MASTERX (Renderização Nativa)
    // ==============================================================
    function abrirJanelaSync(dadosInjetados) {
        if(document.getElementById('masterx-sync-overlay')) return;
        
        // Usa os dados do Sniper se existirem, senão roda a extração da página
        let dados = dadosInjetados || extrairDadosDaPagina();
        
        const o = document.createElement('div');
        o.id = 'masterx-sync-overlay';
        o.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:999999;display:flex;justify-content:center;align-items:center;';
        
        const m = document.createElement('div');
        m.style.cssText = 'background:#222;padding:25px;border-radius:15px;width:340px;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-family:sans-serif;color:#fff;text-align:center;border: 1px solid #00f6ff;';
        
        m.innerHTML = `
          <h2 style="margin-top:0;color:#00f6ff;">⚡ Sync -> P2 Player</h2>
          <div style="color:#ffeb3b;font-size:12px;margin-bottom:15px;">Alvo: <b>P2 PLAYER</b></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;text-align:left;">
            <div>
              <label style="font-size:12px;color:#aaa;">Usuário:</label>
              <input id="mx-user" type="text" value="${dados.usuario}" style="width:100%;padding:8px;margin-top:2px;border-radius:8px;border:none;background:#333;color:#fff;font-size:14px;">
            </div>
            <div>
              <label style="font-size:12px;color:#aaa;">Senha:</label>
              <input id="mx-senha" type="text" value="${dados.senha}" style="width:100%;padding:8px;margin-top:2px;border-radius:8px;border:none;background:#333;color:#fff;font-size:14px;">
            </div>
          </div>
          <div style="text-align:left;margin-bottom:15px;">
            <label style="font-size:12px;color:#aaa;">Expiração Correta (+1 p/ Anular Fuso):</label>
            <input id="mx-exp" type="text" value="${dados.expFormatada}" style="width:100%;padding:10px;margin-top:5px;border-radius:8px;border:none;background:#333;color:#fff;font-size:16px;">
          </div>
          <div style="text-align:left;margin-bottom:20px;">
            <label style="font-size:12px;color:#aaa;">Nome/Device:</label>
            <input id="mx-nome" type="text" value="${dados.comentario.replace(/\n/g, ' ')}" style="width:100%;padding:10px;margin-top:5px;border-radius:8px;border:none;background:#333;color:#fff;font-size:16px;">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
            <button id="mx-btn-criar" style="padding:12px;border:none;border-radius:8px;background:#00ff88;color:#000;font-weight:bold;cursor:pointer;">➕ CRIAR</button>
            <button id="mx-btn-renovar" style="padding:12px;border:none;border-radius:8px;background:#2962ff;color:#fff;font-weight:bold;cursor:pointer;">🔄 RENOVAR</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
            <button id="mx-btn-editar" style="padding:12px;border:none;border-radius:8px;background:#ff8c00;color:#fff;font-weight:bold;cursor:pointer;">✏️ EDITAR</button>
            <button id="mx-btn-deletar" style="padding:12px;border:none;border-radius:8px;background:#d32f2f;color:#fff;font-weight:bold;cursor:pointer;">🗑️ APAGAR</button>
          </div>
          <button id="mx-btn-fechar-modal" style="width:100%;padding:12px;border:1px solid #555;border-radius:8px;background:transparent;color:#aaa;cursor:pointer;">❌ Fechar</button>
          <div id="mx-status" style="margin-top:15px;font-size:14px;font-weight:bold;"></div>
        `;
        
        o.appendChild(m); document.body.appendChild(o);
        
        document.getElementById('mx-btn-fechar-modal').onclick = () => {
            o.remove();
            resetarBolha();
        };
        
        function acaoMasterX(t) {
            const s = document.getElementById('mx-status'); 
            s.innerHTML = '⏳ Processando...'; s.style.color = '#ffeb3b';

            const p = {
                acao: t,
                usuario_cliente: document.getElementById('mx-user').value,
                novo_nome: document.getElementById('mx-nome').value,
                senha_cliente: document.getElementById('mx-senha').value,
                data_expiracao: document.getElementById('mx-exp').value
            };
            
            GM_xmlhttpRequest({
                method: "POST",
                url: LINK_WORKER_P2,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(p),
                onload: function(response) {
                    try {
                        let d = JSON.parse(response.responseText);
                        s.innerHTML = d.msg; 
                        s.style.color = d.status === 'sucesso' ? '#00ff88' : '#ff4444';
                    } catch(e) {
                        s.innerHTML = '❌ O Worker do Cloudflare retornou um erro interno.'; 
                        s.style.color = '#ff4444';
                    }
                },
                onerror: function(error) {
                    s.innerHTML = '❌ Conexão Bloqueada. Verifique o Worker.'; 
                    s.style.color = '#ff4444';
                }
            });
        }
        
        document.getElementById('mx-btn-criar').onclick = () => acaoMasterX('criar');
        document.getElementById('mx-btn-renovar').onclick = () => acaoMasterX('renovar');
        document.getElementById('mx-btn-editar').onclick = () => acaoMasterX('editar');
        document.getElementById('mx-btn-deletar').onclick = () => acaoMasterX('deletar');
    }

    // ==============================================================
    // 3. O MÓDULO SNIPER (Para a tabela do P2 Player)
    // ==============================================================
    function injetarBotoesSniperP2() {
        let linhas = document.querySelectorAll('table tbody tr');
        
        linhas.forEach(linha => {
            let colunas = linha.querySelectorAll('td');
            // Estrutura do P2 geralmente tem 5 ou mais colunas
            if (colunas.length >= 5 && !linha.querySelector('.btn-sniper-sync')) {
                
                // O botão de ações fica na última coluna visível (ou índice 4)
                let colunaAcoes = colunas[4] || colunas[colunas.length - 1];
                let divBotoes = colunaAcoes.querySelector('.btn-group') || colunaAcoes;
                
                let btn = document.createElement('button');
                btn.className = 'btn-sniper-sync';
                btn.innerHTML = '⚡ Sync';
                btn.style.cssText = 'background: linear-gradient(135deg, #020617, #1e3a8a); color:#00f6ff; border:1px solid #00f6ff; padding:4px 8px; border-radius:4px; margin-left:5px; cursor:pointer; font-weight:bold; font-size:11px; box-shadow: 0 0 5px rgba(0, 246, 255, 0.4);';
                
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // USUÁRIO (Coluna 0)
                    let usuario = '';
                    let userLink = colunas[0].querySelector("a");
                    if (userLink) {
                        usuario = userLink.innerText.trim();
                    } else {
                        usuario = colunas[0].innerText.split('\n')[0].trim();
                    }
                    
                    // VENCIMENTO (Coluna 1)
                    let expTexto = colunas[1].innerText.trim();
                    let expFormatada = '';
                    let matchData = expTexto.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                    if (matchData) {
                        // Aplica o +1 dia do MasterX
                        let d = new Date(matchData[3], parseInt(matchData[2]) - 1, parseInt(matchData[1]) + 1);
                        expFormatada = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
                    }
                    
                    // NOME / NOTAS (Coluna 4)
                    let cloneCol4 = colunas[4].cloneNode(true);
                    let botoesLixo = cloneCol4.querySelectorAll('button, a, .btn-group, i');
                    botoesLixo.forEach(b => b.remove()); // Tira o texto dos botões originais
                    let notasApenas = cloneCol4.innerText.replace(/Adicionado.*?confiança/gi, '').replace(/\n/g, ' ').trim();
                    notasApenas = notasApenas.replace(/\s{2,}/g, ' ');
                    
                    let comentario = notasApenas || `P2 ${usuario}`;
                    
                    // A SENHA É IGUAL AO USUÁRIO 
                    let senha = usuario; 
                    
                    abrirJanelaSync({usuario, senha, expFormatada, comentario});
                    bolhaEstadoAberto(); // Troca a Bolha para '❌'
                };
                
                divBotoes.appendChild(btn);
            }
        });
    }

    // ==============================================================
    // 4. ESTADOS DA BOLHA M E INJEÇÃO
    // ==============================================================
    function bolhaEstadoAberto() {
        let bolha = document.getElementById('omini-bolha-p2-btn');
        if(!bolha) return;
        bolha.innerHTML = `<span style="font-family: 'Arial Black', sans-serif; font-size: 20px; color: #ff0055; text-shadow: 0 0 10px #ff0055;">❌</span>`;
        bolha.style.background = `linear-gradient(135deg, #450a0a, #991b1b)`;
        bolha.style.borderColor = `#ff0055`;
        bolha.style.boxShadow = `0 0 15px rgba(255, 0, 85, 0.6), inset 0 0 8px rgba(255, 0, 85, 0.3)`;
    }

    function resetarBolha() {
        let bolha = document.getElementById('omini-bolha-p2-btn');
        if(!bolha) return;
        bolha.innerHTML = `<span style="font-family: 'Arial Black', sans-serif; font-size: 24px; font-style: italic; color: #00f6ff; text-shadow: 0 0 10px #00f6ff;">M</span>`;
        bolha.style.background = `linear-gradient(135deg, #020617, #1e3a8a)`;
        bolha.style.borderColor = `#00f6ff`;
        bolha.style.boxShadow = `0 0 15px rgba(0, 246, 255, 0.6), inset 0 0 8px rgba(0, 246, 255, 0.3)`;
    }

    function injetarBolha() {
        if (document.getElementById('omini-bolha-p2-wrapper') || !document.body) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'omini-bolha-p2-wrapper';
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

        bolha.onclick = () => {
            bolha.style.transform = 'scale(0.8)';
            setTimeout(() => bolha.style.transform = 'none', 150);

            let janelaAberta = document.getElementById('masterx-sync-overlay');
            if (janelaAberta) {
                janelaAberta.remove();
                resetarBolha();
            } else {
                abrirJanelaSync(); // Abre extraindo os dados da tela de Edição
                bolhaEstadoAberto();
            }
        };

        wrapper.appendChild(bolha);
        document.body.appendChild(wrapper);
    }

    // 5. CÃO DE GUARDA
    setInterval(() => {
        if (!document.body) return;
        injetarBolha(); 
        injetarBotoesSniperP2(); // Adiciona os botões na tabela

        let bolha = document.getElementById('omini-bolha-p2-btn');
        let janelaAberta = document.getElementById('masterx-sync-overlay');

        if (bolha && bolha.innerHTML.includes('❌') && !janelaAberta) {
            resetarBolha();
        }
    }, 1000);
})();
