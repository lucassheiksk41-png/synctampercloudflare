export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    }
    
    if (request.method === "GET") {
      const scriptUi = `(function(){
        let txt = document.body.innerText;
        function extrair(r){ let m = txt.match(r); return m ? m[1].trim() : ''; }
        
        let usuario = ''; let senha = ''; let expiracaoRaw = ''; 
        let comentario = ''; let expFormatada = ''; let servidorAlvo = '';
        
        let isP2 = window.location.href.includes('p2player');
        
        if (isP2) {
          servidorAlvo = 'principal';
          let allInputs = Array.from(document.querySelectorAll('input'));
          
          let iptUser = allInputs.find(i => /^[0-9]{7,15}$/.test(i.value?.trim()));
          
          let iptSenha = allInputs.find(i => i !== iptUser && i.value?.trim().length >= 5 && !i.value.toLowerCase().includes('concordo') && !i.value.toLowerCase().includes('cancelar') && i.type !== 'button' && i.type !== 'checkbox');
          
          usuario = iptUser ? iptUser.value.trim() : (extrair(/Usuário\\s*\\*?\\s*\\n*\\s*([^\\n]+)/i) || '');
          senha = iptSenha ? iptSenha.value.trim() : (extrair(/Senha\\s*\\n*\\s*([^\\n]+)/i) || '123456');
          
          let dateInput = allInputs.find(i => i.value && (i.value.match(/\\d{2}\\/\\d{2}\\/\\d{4}/) || i.value.match(/\\d{4}-\\d{2}-\\d{2}/)));
          expiracaoRaw = dateInput ? dateInput.value : '';
          if (!expiracaoRaw) {
            let expMatch = txt.match(/(\\d{2}\\/\\d{2}\\/\\d{4})/g);
            expiracaoRaw = expMatch ? expMatch[expMatch.length - 1] : '';
          }
          
          let textareas = Array.from(document.querySelectorAll('textarea'));
          comentario = textareas.length > 0 ? textareas[textareas.length - 1].value : '';
          if (!comentario || comentario.toLowerCase().includes('cancelar')) comentario = 'P2Player';
          
          if (expiracaoRaw) {
            let p = expiracaoRaw.includes('/') ? expiracaoRaw.split(' ')[0].split('/') : expiracaoRaw.split(' ')[0].split('-');
            if(p.length === 3) {
              let ano, mes, dia;
              if(p[0].length === 4) { ano=p[0]; mes=p[1]; dia=p[2]; } else { dia=p[0]; mes=p[1]; ano=p[2]; }
              let d = new Date(ano, mes-1, parseInt(dia) + 1);
              expFormatada = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
            }
          }
        } else {
          servidorAlvo = 'backup';
          usuario = extrair(/Usuário[\\s:]*\\n*\\s*([^\\n]+)/i) || document.querySelector('input[name="username"]')?.value || '';
          senha = extrair(/Senha[\\s:]*\\n*\\s*([^\\n]+)/i) || document.querySelector('input[name="password"]')?.value || '';
          expiracaoRaw = extrair(/Expiração[\\s:]*\\n*\\s*([^\\n]+)/i) || '';
          
          comentario = document.querySelector('textarea[name="notes"], .client-comments')?.value || extrair(/Comentários[\\s:]*\\n*\\s*([^\\n]+)/i) || '';
          
          if (expiracaoRaw) {
            let p = expiracaoRaw.split(' ')[0].split('/');
            if (p.length === 3) {
              let d = new Date(p[2], p[1]-1, parseInt(p[0]) + 1);
              expFormatada = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
            }
          }
        }
        
        const o=document.createElement('div');o.id='masterx-sync-overlay';o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:999999;display:flex;justify-content:center;align-items:center;';
        const m=document.createElement('div');m.style.cssText='background:#222;padding:25px;border-radius:15px;width:340px;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-family:sans-serif;color:#fff;text-align:center;';
        m.innerHTML='<h2 style="margin-top:0;color:#00ff88;">⚡ Sync -> MasterX</h2>' +
          '<div style="color:#ffeb3b;font-size:12px;margin-bottom:15px;">Alvo: <b>' + servidorAlvo.toUpperCase() + '</b></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;text-align:left;"><div>' +
          '<label style="font-size:12px;color:#aaa;">Usuário:</label><input id="mx-user" type="text" value="' + usuario + '" style="width:100%;padding:8px;margin-top:2px;border-radius:8px;border:none;background:#333;color:#fff;font-size:14px;"></div>' +
          '<div><label style="font-size:12px;color:#aaa;">Senha:</label><input id="mx-senha" type="text" value="' + senha + '" style="width:100%;padding:8px;margin-top:2px;border-radius:8px;border:none;background:#333;color:#fff;font-size:14px;"></div></div>' +
          '<div style="text-align:left;margin-bottom:15px;"><label style="font-size:12px;color:#aaa;">Expiração Correta (+1 p/ Anular Fuso):</label><input id="mx-exp" type="text" value="' + expFormatada + '" style="width:100%;padding:10px;margin-top:5px;border-radius:8px;border:none;background:#333;color:#fff;font-size:16px;"></div>' +
          '<div style="text-align:left;margin-bottom:20px;"><label style="font-size:12px;color:#aaa;">Nome/Device:</label><input id="mx-nome" type="text" value="' + comentario.replace(/\\n/g, ' ') + '" style="width:100%;padding:10px;margin-top:5px;border-radius:8px;border:none;background:#333;color:#fff;font-size:16px;"></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;"><button id="mx-btn-criar" style="padding:12px;border:none;border-radius:8px;background:#00ff88;color:#000;font-weight:bold;cursor:pointer;">➕ CRIAR</button><button id="mx-btn-renovar" style="padding:12px;border:none;border-radius:8px;background:#2962ff;color:#fff;font-weight:bold;cursor:pointer;">🔄 RENOVAR</button></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;"><button id="mx-btn-editar" style="padding:12px;border:none;border-radius:8px;background:#ff8c00;color:#fff;font-weight:bold;cursor:pointer;">✏️ EDITAR</button><button id="mx-btn-deletar" style="padding:12px;border:none;border-radius:8px;background:#d32f2f;color:#fff;font-weight:bold;cursor:pointer;">🗑️ APAGAR</button></div>' +
          '<button id="mx-btn-fechar" style="width:100%;padding:12px;border:1px solid #555;border-radius:8px;background:transparent;color:#aaa;cursor:pointer;">❌ Fechar</button>' +
          '<div id="mx-status" style="margin-top:15px;font-size:14px;font-weight:bold;"></div>';
        o.appendChild(m); document.body.appendChild(o);
        document.getElementById('mx-btn-fechar').onclick=()=>o.remove();
        
        function acaoMasterX(t){
          const s=document.getElementById('mx-status');s.innerHTML='⏳ Processando...';s.style.color='#ffeb3b';
          const p={acao:t,servidor_alvo:servidorAlvo,usuario_cliente:document.getElementById('mx-user').value,novo_nome:document.getElementById('mx-nome').value,senha_cliente:document.getElementById('mx-senha').value,data_expiracao:document.getElementById('mx-exp').value};
          fetch('https://syncmaster.lucassheiksk41.workers.dev',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})
          .then(r=>r.json()).then(d=>{s.innerHTML=d.msg;s.style.color=d.status==='sucesso'?'#00ff88':'#ff4444'}).catch(e=>{s.innerHTML='❌ Erro.';s.style.color='#ff4444'});
        }
        document.getElementById('mx-btn-criar').onclick=()=>acaoMasterX('criar');
        document.getElementById('mx-btn-renovar').onclick=()=>acaoMasterX('renovar');
        document.getElementById('mx-btn-editar').onclick=()=>acaoMasterX('editar');
        document.getElementById('mx-btn-deletar').onclick=()=>acaoMasterX('deletar');
      })();`;
      return new Response(scriptUi, { headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/javascript" } });
    }

    if (request.method !== "POST") return new Response("Apenas POST", { status: 405 });
    
    try {
      const ordem = await request.json();
      const userBusca = String(ordem.usuario_cliente).trim();
      
      const contas = [
        { id: "principal", nome: "Principal", username: "Luca$3070", password: "20205070" },
        { id: "backup", nome: "Backup", username: "DNABackup20", password: "55qLZdwNmNSG" }
      ];
      
      let contasParaRodar = ordem.servidor_alvo === "backup" ? contas.filter(c => c.id === "backup") : (ordem.servidor_alvo === "principal" ? contas.filter(c => c.id === "principal") : contas);
      
      for (const conta of contasParaRodar) {
          try {
              const reqLogin = await fetch("https://painelmaster.app/api/v1/auth/login", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: conta.username, password: conta.password, role: "reseller" })
              });
              const resLogin = await reqLogin.json();
              const tokenAcesso = resLogin.token || resLogin.access_token;
              
              if (!tokenAcesso) continue; 
              
              if (ordem.acao === "criar") {
                  const linhaCsv = `tipo,username,password,exp_date,max_connections,reseller,display_name\ncliente,${userBusca},${ordem.senha_cliente},${ordem.data_expiracao},1,cliente,${ordem.novo_nome}`;
                  const reqImportar = await fetch("https://painelmaster.app/api/v1/reseller/import", {
                      method: "POST",
                      headers: { "Authorization": `Bearer ${tokenAcesso}`, "Content-Type": "application/json" },
                      body: JSON.stringify({ content: linhaCsv, default_max_connections: 1, skip_existing: true })
                  });
                  const resImportar = await reqImportar.json();
                  if(reqImportar.ok) return new Response(JSON.stringify({ status: "sucesso", msg: `✅ Criado no ${conta.nome}!` }), { headers: { "Access-Control-Allow-Origin": "*" } });
                  else return new Response(JSON.stringify({ status: "erro", msg: `❌ Recusado: ${JSON.stringify(resImportar.error || resImportar)}` }), { headers: { "Access-Control-Allow-Origin": "*" } });
              }

              let clienteEncontrado = null;
              for (let pagina = 1; pagina <= 15; pagina++) {
                  const reqBusca = await fetch(`https://painelmaster.app/api/v1/reseller/lines?page=${pagina}`, {
                    method: "GET", headers: { "Authorization": `Bearer ${tokenAcesso}` }
                  });
                  const resBusca = await reqBusca.json();
                  const lista = resBusca.data || resBusca.items || resBusca || [];
                  if (lista.length === 0) break;
                  clienteEncontrado = lista.find(c => String(c.username).trim() === userBusca);
                  if (clienteEncontrado) break; 
              }
              
              if (clienteEncontrado) {
                 const id_cliente = clienteEncontrado.id;
                 let reqAcao;
                 
                 if (ordem.acao === "renovar") {
                    
                    // ==============================================================
                    // MÁGICA DE RENOVAÇÃO: Caçador de Pacotes BLINDADO (Só 1 Mês)
                    // ==============================================================
                    let planIdToUse = 510; // ID de segurança antigo
                    try {
                        let reqPlanos = await fetch('https://painelmaster.app/api/v1/reseller/plans', { headers: { 'Authorization': `Bearer ${tokenAcesso}` } });
                        if (!reqPlanos.ok) reqPlanos = await fetch('https://painelmaster.app/api/v1/reseller/packages', { headers: { 'Authorization': `Bearer ${tokenAcesso}` } });
                        if (reqPlanos.ok) {
                            let resPlanos = await reqPlanos.json();
                            let listaPlanos = resPlanos.data || resPlanos.items || resPlanos || [];
                            
                            // Regex Blindada: Acha '1 mes', '1 mês' ou '1 cred'. 
                            // O \b garante que é o número 1 exato. Ignora '11 meses' ou '12 meses'.
                            let planoCerto = listaPlanos.find(p => {
                                let nomePlano = (p.name || '').toLowerCase();
                                return /\b1\s*m[eê]s\b/.test(nomePlano) || /\b1\s*cr[eé]d/.test(nomePlano);
                            });
                            
                            if (planoCerto && planoCerto.id) {
                                planIdToUse = planoCerto.id;
                            }
                        }
                    } catch (e) {} 
                    
                    reqAcao = await fetch(`https://painelmaster.app/api/v1/reseller/lines/${id_cliente}/renew`, { 
                        method: "POST", 
                        headers: { "Authorization": `Bearer ${tokenAcesso}`, "Content-Type": "application/json" }, 
                        body: JSON.stringify({ plan_id: planIdToUse, package_id: planIdToUse }) 
                    });

                 } else if (ordem.acao === "editar") {
                    reqAcao = await fetch(`https://painelmaster.app/api/v1/reseller/lines/${id_cliente}`, { method: "PATCH", headers: { "Authorization": `Bearer ${tokenAcesso}`, "Content-Type": "application/json" }, body: JSON.stringify({ display_name: ordem.novo_nome, bouquets: clienteEncontrado.bouquets || [1,2,3], max_connections: clienteEncontrado.max_connections || 1 }) });
                 } else if (ordem.acao === "deletar") {
                    reqAcao = await fetch(`https://painelmaster.app/api/v1/reseller/lines/${id_cliente}/permanent`, { method: "DELETE", headers: { "Authorization": `Bearer ${tokenAcesso}` } });
                 }
                 
                 if(reqAcao.ok) return new Response(JSON.stringify({ status: "sucesso", msg: `✅ Renovado! Cobrado 1 crédito.` }), { headers: { "Access-Control-Allow-Origin": "*" } });
                 else {
                    let errTxt = await reqAcao.text();
                    let errMsg = errTxt.length > 40 ? errTxt.substring(0, 40) + "..." : errTxt;
                    return new Response(JSON.stringify({ status: "erro", msg: `❌ Recusado: ${errMsg}` }), { headers: { "Access-Control-Allow-Origin": "*" } });
                 }
              }
          } catch (e) { continue; }
      }
      return new Response(JSON.stringify({ status: "erro", msg: "❌ Conta não achada na lista." }), { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (e) { return new Response("Erro: " + e.message, { status: 500 }); }
  }
};
