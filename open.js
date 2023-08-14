const { text } = require("express");
const puppeteer = require("puppeteer");

function open() {
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 600,
  });
  await page.goto("https://www.bling.com.br/");
  await page.hover("#dropdown");
  await page.waitForTimeout(1000);
  await page.type("#username", "goon@ruthgama");
  await page.type("#senha", "@Goon123");
  await page.click(".button-primary-site");
  await page.waitForNavigation();
  await page.goto("https://www.bling.com.br/b/ordem.servicos.php#list", {
    waitUntil: "domcontentloaded",
  })
  const localLimpa = ".clear-tag";
  await page.waitForSelector(localLimpa);
  await page.click(localLimpa);

  const resultado = '[idsituacao="632"]';
  await page.waitForSelector(resultado)
  const services = await page.evaluate((resultado) => {
    let infos = document.querySelectorAll(resultado);
    let info = [];
    let situacao = [
      { id: "632", situacao: "Em aberto" },
      { id: "635", situacao: "Orçada" },
      { id: "638", situacao: "Serviço concluído" },
      { id: "641", situacao: "Finalizada" },
      { id: "644", situacao: "Não aprovada" },
      { id: "647", situacao: "Aprovada" },
      { id: "650", situacao: "Em andamento" },
      { id: "653", situacao: "Aguardando componentes" },
      { id: "656", situacao: "Finalizada sem conserto" },
    ];
    for (let i = 0; i < infos.length; i++) {
      info += `
                    { 
                    "idServico": "${infos[i].attributes[0].textContent}",
                    "idContato": "${infos[i].attributes[1].textContent}",
                    "situacao": "${situacao.filter(
        (situacao) =>
          situacao.id == infos[i].attributes[4].textContent
      )[0].situacao
        }",
                    "numeroOs": "10${infos[i].attributes[14].textContent}",
                    "data": "${infos[i].attributes[15].textContent}",
                    "cliente": "${infos[i].attributes[18].textContent}",
                    },
                    `;
    }
    return [info];
  }, resultado);
  let json = JSON.stringify(services);
  const resformt = json
    .replace(/\\n/gi, "")
    .replace(/\\/gi, "")
    .replace(/                        /gi, "")
    .replace(/                    /gi, "")
    .replace(/                /gi, "")
    .replace(/\["/gi, "[")
    .replace(/\,"]/gi, "]")
    .replace(/,},{/gi, "},{")
    .replace(/,}]/, "}]");
  var formated = JSON.parse(resformt);

  let infoService = [];
  for (let i = 0; i < formated.length; i++) {
    await page.goto(
      `https://www.bling.com.br/ordem.servicos.php#edit/${formated[i].idServico}`,
      { waitUntil: "domcontentloaded" }
    );
    let idServico = `"idServico":"${formated[i].idServico}"`;
    let idContato = `"idContato":"${formated[i].idContato}"`;
    let situacao = `"situacao":"${formated[i].situacao}"`;
    let numeroOs = `"numeroOs":"${formated[i].numeroOs}"`;
    let data = `"data":"${formated[i].data}"`;
    let cliente = `"cliente":"${formated[i].cliente}"`;

    await page.waitForTimeout(4000);

    const amountServicesDOM = "#gritens > tbody > tr";
    await page.waitForSelector(amountServicesDOM);

    const amountService = await page.evaluate((amountServicesDOM) => {
      let amountServicesLength = document.querySelectorAll(amountServicesDOM)
      let amountServicesItem = []
      for (let i = 1; i < amountServicesLength.length - 1; i++) {
        amountServicesItem += `{"item":"${i}","servico":"${amountServicesLength[i].attributes[0].ownerElement.childNodes[0].lastChild.defaultValue.replace(/"/gi, ' ¬ ')}"},`
      }
      return amountServicesItem;
    }, amountServicesDOM);

    const amountEquipamentDOM = "#gritensPecas > tbody > tr";
    await page.waitForSelector(amountEquipamentDOM);
    const amountEquipament = await page.evaluate((amountEquipamentDOM) => {
      let amountEquipamentLength = document.querySelectorAll(amountEquipamentDOM)
      let amountEquipamentItem = []
      for (let i = 1; i < amountEquipamentLength.length - 1; i++) {
        amountEquipamentItem += `{"item":"${i}","equipamento":"${amountEquipamentLength[i].attributes[0].ownerElement.childNodes[0].lastChild.defaultValue.replace(/"/gi, ' ¬ ')}"},`
      }
      return amountEquipamentItem;
    }, amountEquipamentDOM);

    const amountNumeroSerie = "#equipamento_serie";
    await page.waitForSelector(amountNumeroSerie);
    const numeroSeriesItem = await page.evaluate((amountNumeroSerie) => {
      let numeroSeriesItem = `"numeroSerie":"${document.querySelector(amountNumeroSerie).value
        }"`;
      return numeroSeriesItem;
    }, amountNumeroSerie);
    // console.log(numeroSeriesItem);


    const amountObservation = "#observacoes";
    await page.waitForSelector(amountObservation);
    const observationItem = await page.evaluate((amountObservation) => {
      let observationItem = `"observacao":"${document.querySelector(amountObservation).value
        }"`;
      return observationItem;
    }, amountObservation);
    // console.log(observationItem);

    const amountType = "#descricaoProblema";
    await page.waitForSelector(amountType);
    const typeItem = await page.evaluate((amountType) => {
      let typeItem = `"descricao_problema":"${document.querySelector(amountType).value
        }"`;
      return typeItem;
    }, amountType);
    // console.log(typeItem);

    await page.waitForTimeout(1000);

    await page.goto(
      `https://www.bling.com.br/contatos.php#edit/${formated[i].idContato}`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForTimeout(4000);
    const cepOS = "#cep";
    await page.waitForSelector(cepOS);
    const cep = await page.evaluate((cepOS) => {
      let cep = `"cep":"${document.querySelector(cepOS).value}"`;
      return cep;
    }, cepOS);
    const ufOS = "#uf";
    await page.waitForSelector(ufOS);
    const uf = await page.evaluate((ufOS) => {
      let uf = `"uf":"${document.querySelector(ufOS).value}"`;
      return uf;
    }, ufOS);
    const cidadeOS = "#cidade";
    await page.waitForSelector(cidadeOS);
    const cidade = await page.evaluate((cidadeOS) => {
      let cidade = `"cidade":"${document.querySelector(cidadeOS).value}"`;
      return cidade;
    }, cidadeOS);
    const bairroOS = "#bairro";
    await page.waitForSelector(bairroOS);
    const bairro = await page.evaluate((bairroOS) => {
      let bairro = `"bairro":"${document.querySelector(bairroOS).value}"`;
      return bairro;
    }, bairroOS);
    const enderecoOS = "#endereco";
    await page.waitForSelector(enderecoOS);
    const endereco = await page.evaluate((enderecoOS) => {
      let endereco = `"endereco":"${document.querySelector(enderecoOS).value}"`;
      return endereco;
    }, enderecoOS);
    const enderecoNroOS = "#enderecoNro";
    await page.waitForSelector(enderecoNroOS);
    const enderecoNro = await page.evaluate((enderecoNroOS) => {
      let enderecoNro = `"enderecoNro":"${document.querySelector(enderecoNroOS).value
        }"`;
      return enderecoNro;
    }, enderecoNroOS);
    const emailSelct = "#email";
    await page.waitForSelector(emailSelct);
    const email = await page.evaluate((emailSelct) => {
          let email = `"email":"${document.querySelector(emailSelct).value
        }"`;
      return email
    }, emailSelct);
    const foneSelect = "#fone";
    await page.waitForSelector(foneSelect);
    const fone = await page.evaluate((foneSelect) => {
      let fone = `"fone":"${document.querySelector(foneSelect).value
        }"`;
      return fone;
    }, foneSelect);
    const celularSelect = "#celular";
    await page.waitForSelector(celularSelect);
    const celular = await page.evaluate((celularSelect) => {
      let celular = `"celular":"${document.querySelector(celularSelect).value
        }"`;
      return celular;
    }, celularSelect);
    const contatosSelect = "#contatos";
    await page.waitForSelector(contatosSelect);
    const contatos = await page.evaluate((contatosSelect) => {
      let contatos = `"contatos":"${document.querySelector(contatosSelect).value
        }"`;
      return contatos;
    }, contatosSelect);
    await page.waitForTimeout(1000);

    infoService += `{${idServico},${idContato},${situacao},${numeroOs},${data},${cliente.replace(/(\r\n|\n|\r)/gm, " ")},"equipamentos":[${amountEquipament.slice(0, amountEquipament.length - 1)}],"servicos":[${amountService.slice(0, amountService.length - 1)}],${numeroSeriesItem.replace(/(\r\n|\n|\r)/gm, " ")},${observationItem.replace(/(\r\n|\n|\r)/gm, " ")},${typeItem.replace(/(\r\n|\n|\r)/gm, " ")},${cep},${uf},${cidade},${bairro},${endereco.replace(/(\r\n|\n|\r)/gm, "")},${enderecoNro},${email},${fone},${celular},${contatos}},`;

  }
  await browser.close();

  let jsonInfo = JSON.stringify([infoService]);
  const resformtInfo = jsonInfo
    .replace(/\\n/gi, "")
    .replace(/\\/gi, "")
    .replace(/                    /gi, "")
    .replace(/                /gi, "")
    .replace(/\["/gi, "[")
    .replace(/\,"]/gi, "]")
    .replace(/,},{/gi, "},{")
    .replace(/,}]/, "}]");
  let filtroService = JSON.parse(resformtInfo);
  let service = async (filtroService, i) => {
    try {
      fetch(`http://localhost:3000/${filtroService[i].idServico}`, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            console.log(data.length);
            try {
              let d = new Date();
              let ye = new Intl.DateTimeFormat("en", {
                year: "numeric",
              }).format(d);
              let mo = new Intl.DateTimeFormat("en", {
                month: "2-digit",
              }).format(d);
              let da = new Intl.DateTimeFormat("en", {
                day: "2-digit",
              }).format(d);
              let ho = new Intl.DateTimeFormat("pt", {
                hour: "2-digit",
              }).format(d);
              let mi = new Intl.DateTimeFormat("pt", {
                minute: "2-digit",
              }).format(d);
              let se = new Intl.DateTimeFormat("pt", {
                second: "2-digit",
              }).format(d);
              const dataService = `${ye}-${mo}-${da}T${ho}:${mi < 10 ? "0" + mi : mi}:${se < 10 ? "0" + se : se}`;
              function menoQuatro(item) {
                return item.substring(4)
              }

              function emails(email){
                if(email.search(",") > 0){
                  return email.split(',')[0]
                } else if (email.search(",") > 0){
                  return email.split(';')[0]
                } else {
                  return email
                }
              }

              function jsonClear(texto) {
                console.log(JSON.stringify(texto));
                if (JSON.stringify(texto) == undefined) {
                  return ""
                } else {
                  return JSON.stringify(texto).replace(/\{/gi,'').replace(/\"/gi,' ').replace(/\}/gi,'\n')
                }
              }

              
              let dataOrderService = `
             <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
             <soap:Body>
             <OpenOrdemServicoWithClienteInfo xmlns="http://www.equiperemota.com.br">
             <authCode>445AC22D216099BDC082352675B410C3583F29FA</authCode>
             <clientCode>JCTTHRGOMARUKVEBUQZV</clientCode>
             <externalClienteID>${menoQuatro(filtroService[i].idContato)}</externalClienteID>
             <clienteMatricula>${menoQuatro(filtroService[i].idContato)}</clienteMatricula>
             <clienteNome>${filtroService[i].cliente}</clienteNome>
             <clienteEndereco>${filtroService[i].endereco}</clienteEndereco>
             <clienteEnderecoNumero>${filtroService[i].enderecoNro}</clienteEnderecoNumero>
             <clienteEnderecoBairro>${filtroService[i].bairro}</clienteEnderecoBairro>
             <clienteCidade>${filtroService[i].cidade}</clienteCidade>
             <clienteUF>${filtroService[i].uf}</clienteUF>
             <clienteCEP>${filtroService[i].cep}</clienteCEP>     
             <clienteTelefoneResidencial>${filtroService[i].fone}</clienteTelefoneResidencial>
             <clienteTelefoneComercial>${filtroService[i].fone}</clienteTelefoneComercial>
             <clienteTelefoneCelular>${filtroService[i].celular}</clienteTelefoneCelular>
             <clienteEmail>${emails(filtroService[i].email)}</clienteEmail>
             <clienteAtivo>true</clienteAtivo>
             <clienteAtendidoEmTodosTiposServicos>true</clienteAtendidoEmTodosTiposServicos>
             <externalID>${filtroService[i].numeroOs}</externalID>
             <externalClienteID>${menoQuatro(filtroService[i].idContato)}</externalClienteID>
             <externalTipoServicoID>2</externalTipoServicoID>
             <dataSolicitacao>${dataService}</dataSolicitacao>
             <prioridade>N</prioridade>  
             <contatoNome>${filtroService[i].contatos}</contatoNome>
             <contatoTelefone>${filtroService[i].celular}</contatoTelefone>     
             <endereco>${filtroService[i].endereco}</endereco>
             <enderecoNumero>${filtroService[i].enderecoNumero}</enderecoNumero>
             <enderecoBairro>${filtroService[i].bairro}</enderecoBairro>
             <cidade>${filtroService[i].cidade}</cidade>
             <uF>${filtroService[i].uf}</uF>
             <cEP>${filtroService[i].cep}</cEP>  
             <descricao>
             Numero de Série: ${filtroService[i].numeroSerie}
             
             Descrição: ${filtroService[i].observacao}
             </descricao>    
             <dataCriacao>${dataService}</dataCriacao>
             <numeroOS>${filtroService[i].numeroOs}</numeroOS>
             <dynFormCreateFormXML>
             <![CDATA[
              <DynFormAnswer>
              <ItemAnswer>
              <ItemCode>1DRCK3FN</ItemCode>
              <TextAnswer>Magazine Gama</TextAnswer>
              </ItemAnswer>
              <ItemAnswer>
              <ItemCode>FZZC1KFN</ItemCode>
              <TextAnswer>${filtroService[i].numeroOs}</TextAnswer>
              </ItemAnswer>
              <ItemAnswer>
              <ItemCode>YEWZFWP7</ItemCode>
              <TextAnswer>${jsonClear(filtroService[i].servicos)}</TextAnswer>
              </ItemAnswer>
              <ItemAnswer>
              <ItemCode>OCOCD16N</ItemCode>
              <TextAnswer>${filtroService[i].descricao_problema}</TextAnswer>
              </ItemAnswer>
              <ItemAnswer>
              <ItemCode>OCOCD17N</ItemCode>
              <TextAnswer>${jsonClear(filtroService[i].equipamentos)}</TextAnswer>
              </ItemAnswer>
              </DynFormAnswer>              
              ]]>
              </dynFormCreateFormXML>
             </OpenOrdemServicoWithClienteInfo>
             </soap:Body>
             </soap:Envelope>
        `;

      
              console.log(dataOrderService);

              fetch(`https://ws.goon.mobi/webservices/keeplefieldintegration.asmx?wsdl`, {
                method: 'POST',
                body: dataOrderService,
                headers: {
                  'Content-Type': 'text/xml; charset=utf-8',
                  'Accept': '*/*',
                }
              })
                .then(res => res.text())
                .then(data => {
                  console.log(`serviço criado: ${data}`);
                  try {                    
                    const jsonData = `
          {
            "idServico":"${filtroService[i].idServico}",
            "idContato":"${filtroService[i].idContato}",
            "situacao":"${filtroService[i].situacao}",
            "numeroOs":"${filtroService[i].numeroOs}",
            "data":"${filtroService[i].data}",
            "cliente":"${filtroService[i].cliente}",
            "cep":"${filtroService[i].cep}",
            "uf":"${filtroService[i].uf}",
            "cidade":"${filtroService[i].cidade}",
            "bairro":"${filtroService[i].bairro}",
            "endereco":"${filtroService[i].endereco}",              
            "enderecoNumero":"${filtroService[i].enderecoNumero}",
            "email":"${filtroService[i].email}",
            "fone":"${filtroService[i].fone}",
            "celular":"${filtroService[i].celular}",
            "contato":"${filtroService[i].contatos}",
            "equipamentos":[${JSON.stringify(filtroService[i].equipamentos) == undefined? "" : JSON.stringify(filtroService[i].equipamentos)}],
            "servicos":[${JSON.stringify(filtroService[i].servicos) == undefined? "" : JSON.stringify(filtroService[i].servicos)}],
            "numeroSerie":"${filtroService[i].numeroSerie}",
            "problema":"${filtroService[i].descricao_problema}",              
            "observacao":"${filtroService[i].observacao}"
          }
          `
          console.log(jsonData);
                    fetch(`http://localhost:3000/`, {
                      method: 'POST',
                      body: jsonData,
                      headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                      }
                    }).then(res => res.json())
                      .then(data => {
                        console.log(`Adicionado serviço em dados.json: ${JSON.stringify(data)}`);
                      })
                  } catch (error) {
                   if (error.toString().search("email")) {
                    console.log("e-mail falso");
                   } else {
                    error
                   }
                  }
                })
            } catch (error) {
              console.log(error);
            }
          } else if (data[0].observacao !== filtroService[i].observacao || data[0].equipamentos !== filtroService[i].equipamentos || data[0].servicos !== filtroService[i].servicos)  {

            try {
              console.log(`deletar serviço no goon: ${JSON.stringify(data)}`);
              const deleteSevice = ` 
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <DeactivateOrdemServicoByNumeroOS xmlns="http://www.equiperemota.com.br">
    <authCode>D5BFBF04A75FB09B869C98ACDB59E0C65EE194EF</authCode>
    <clientCode>JCTTHRGOMARUKVEBUQZV</clientCode>
    <numeroOS>${filtroService[i].numeroOs}</numeroOS>
  </DeactivateOrdemServicoByNumeroOS>
</soap:Body>
</soap:Envelope>`;
              fetch(`https://ws.goon.mobi/webservices/keeplefieldintegration.asmx?wsdl`, {
                method: 'POST',
                body: deleteSevice,
                headers: {
                  'Content-Type': 'text/xml; charset=utf-8',
                  'Accept': '*/*',
                }
              })
                .then(res => res.text())
                .then(data => {
                  console.log(`deletar serviço  no goon: ${JSON.stringify(data)}`);
                  const clearResp = data.slice(data.search("{"), data.search("}"))
                  const jsonResp = JSON.parse(clearResp.search("}") < 0 ? clearResp + "}" : clearResp)
                  console.log(jsonResp);
                  try {
                    console.log(`deletado serviço  no data.json: ${JSON.stringify(data)}`);
                    const jsonData = `
                    {
                      "idServico":"${filtroService[i].idServico}",
                      "idContato":"${filtroService[i].idContato}",
                      "situacao":"${filtroService[i].situacao}",
                      "numeroOs":"${filtroService[i].numeroOs}",
                      "data":"${filtroService[i].data}",
                      "cliente":"${filtroService[i].cliente}",
                      "cep":"${filtroService[i].cep}",
                      "uf":"${filtroService[i].uf}",
                      "cidade":"${filtroService[i].cidade}",
                      "bairro":"${filtroService[i].bairro}",
                      "endereco":"${filtroService[i].endereco}",              
                      "enderecoNumero":"${filtroService[i].enderecoNumero}",
                      "email":"${filtroService[i].email}",
                      "fone":"${filtroService[i].fone}",
                      "celular":"${filtroService[i].celular}",
                      "contato":"${filtroService[i].contatos}",
                      "equipamentos":[${JSON.stringify(filtroService[i].equipamentos) == undefined? "" : JSON.stringify(filtroService[i].equipamentos)}],
                      "servicos":[${JSON.stringify(filtroService[i].servicos) == undefined? "" : JSON.stringify(filtroService[i].servicos)}],
                      "numeroSerie":"${filtroService[i].numeroSerie}",
                      "problema":"${filtroService[i].descricao_problema}",              
                      "observacao":"${filtroService[i].observacao}"
                  }
  `
  console.log('jsonData')
  fetch(`http://localhost:3000/${filtroService[i].idServico}`, {
                      method: 'POST',
                      body: jsonData,
                      headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                      }
                    })
                      .then(res => res.json())
                      .then(data => {
                        console.log(`deletado serviço  no data.json: ${JSON.stringify(JSON.stringify(data))}`);
                        try {
                          let d = new Date();
                          let ye = new Intl.DateTimeFormat("en", {
                            year: "numeric",
                          }).format(d);
                          let mo = new Intl.DateTimeFormat("en", {
                            month: "2-digit",
                          }).format(d);
                          let da = new Intl.DateTimeFormat("en", {
                            day: "2-digit",
                          }).format(d);
                          let ho = new Intl.DateTimeFormat("pt", {
                            hour: "2-digit",
                          }).format(d);
                          let mi = new Intl.DateTimeFormat("pt", {
                            minute: "2-digit",
                          }).format(d);
                          let se = new Intl.DateTimeFormat("pt", {
                            second: "2-digit",
                          }).format(d);
                          const dataService = `${ye}-${mo}-${da}T${ho}:${mi < 10 ? "0" + mi : mi}:${se < 10 ? "0" + se : se}`;
                          function menoQuatro(item) {
                            return item.substring(4)
                          }
            
                          function menoQuatro(item) {
                            return item.substring(4)
                          }
            
                          function emails(email){
                            if(email.search(",") > 0){
                              return email.split(',')[0]
                            } else if (email.search(",") > 0){
                              return email.split(';')[0]
                            } else {
                              return email
                            }
                          }
            
                          function jsonClear(texto) {
                            console.log(JSON.stringify(texto));
                            if (JSON.stringify(texto) == undefined) {
                              return ""
                            } else {
                              return JSON.stringify(texto).replace(/\{/gi,'').replace(/\"/gi,' ').replace(/\}/gi,'\n')
                            }
                          }
            
            
                          
                          let dataOrderService = `
                         <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                         <soap:Body>
                         <OpenOrdemServicoWithClienteInfo xmlns="http://www.equiperemota.com.br">
                         <authCode>445AC22D216099BDC082352675B410C3583F29FA</authCode>
                         <clientCode>JCTTHRGOMARUKVEBUQZV</clientCode>
                         <externalClienteID>${menoQuatro(filtroService[i].idContato)}</externalClienteID>
                         <clienteMatricula>${menoQuatro(filtroService[i].idContato)}</clienteMatricula>
                         <clienteNome>${filtroService[i].cliente}</clienteNome>
                         <clienteEndereco>${filtroService[i].endereco}</clienteEndereco>
                         <clienteEnderecoNumero>${filtroService[i].enderecoNro}</clienteEnderecoNumero>
                         <clienteEnderecoBairro>${filtroService[i].bairro}</clienteEnderecoBairro>
                         <clienteCidade>${filtroService[i].cidade}</clienteCidade>
                         <clienteUF>${filtroService[i].uf}</clienteUF>
                         <clienteCEP>${filtroService[i].cep}</clienteCEP>     
                         <clienteTelefoneResidencial>${filtroService[i].fone}</clienteTelefoneResidencial>
                         <clienteTelefoneComercial>${filtroService[i].fone}</clienteTelefoneComercial>
                         <clienteTelefoneCelular>${filtroService[i].celular}</clienteTelefoneCelular>
                         <clienteEmail>${emails(filtroService[i].email)}</clienteEmail>
                         <clienteAtivo>true</clienteAtivo>
                         <clienteAtendidoEmTodosTiposServicos>true</clienteAtendidoEmTodosTiposServicos>
                         <externalID>${filtroService[i].numeroOs}</externalID>
                         <externalClienteID>${menoQuatro(filtroService[i].idContato)}</externalClienteID>
                         <externalTipoServicoID>2</externalTipoServicoID>
                         <dataSolicitacao>${dataService}</dataSolicitacao>
                         <prioridade>N</prioridade>  
                         <contatoNome>${filtroService[i].contatos}</contatoNome>
                         <contatoTelefone>${filtroService[i].celular}</contatoTelefone>     
                         <endereco>${filtroService[i].endereco}</endereco>
                         <enderecoNumero>${filtroService[i].enderecoNumero}</enderecoNumero>
                         <enderecoBairro>${filtroService[i].bairro}</enderecoBairro>
                         <cidade>${filtroService[i].cidade}</cidade>
                         <uF>${filtroService[i].uf}</uF>
                         <cEP>${filtroService[i].cep}</cEP>  
                         <descricao>
                         Numero de Série: ${filtroService[i].numeroSerie}
                         
                         Descrição: ${filtroService[i].observacao}
                         </descricao>    
                         <dataCriacao>${dataService}</dataCriacao>
                         <numeroOS>${filtroService[i].numeroOs}</numeroOS>
                         <dynFormCreateFormXML>
                         <![CDATA[
                          <DynFormAnswer>
                          <ItemAnswer>
                          <ItemCode>1DRCK3FN</ItemCode>
                          <TextAnswer>Magazine Gama</TextAnswer>
                          </ItemAnswer>
                          <ItemAnswer>
                          <ItemCode>FZZC1KFN</ItemCode>
                          <TextAnswer>${filtroService[i].numeroOs}</TextAnswer>
                          </ItemAnswer>
                          <ItemAnswer>
                          <ItemCode>YEWZFWP7</ItemCode>
                          <TextAnswer>${jsonClear(filtroService[i].servicos)}</TextAnswer>
                          </ItemAnswer>
                          <ItemAnswer>
                          <ItemCode>OCOCD16N</ItemCode>
                          <TextAnswer>${filtroService[i].descricao_problema}</TextAnswer>
                          </ItemAnswer>
                          <ItemAnswer>
                          <ItemCode>OCOCD17N</ItemCode>
                          <TextAnswer>${jsonClear(filtroService[i].equipamentos)}</TextAnswer>
                          </ItemAnswer>
                          </DynFormAnswer>              
                          ]]>
                          </dynFormCreateFormXML>
                         </OpenOrdemServicoWithClienteInfo>
                         </soap:Body>
                         </soap:Envelope>
                    `;
            
                  
                          console.log(dataOrderService);
            
                          fetch(`https://ws.goon.mobi/webservices/keeplefieldintegration.asmx?wsdl`, {
                            method: 'POST',
                            body: dataOrderService,
                            headers: {
                              'Content-Type': 'text/xml; charset=utf-8',
                              'Accept': '*/*',
                            }
                          })
                            .then(res => res.text())
                            .then(data => {
                              console.log(`serviço criado: ${data}`);
                              try {                    
                                const jsonData = `
                      {
                        "idServico":"${filtroService[i].idServico}",
                        "idContato":"${filtroService[i].idContato}",
                        "situacao":"${filtroService[i].situacao}",
                        "numeroOs":"${filtroService[i].numeroOs}",
                        "data":"${filtroService[i].data}",
                        "cliente":"${filtroService[i].cliente}",
                        "cep":"${filtroService[i].cep}",
                        "uf":"${filtroService[i].uf}",
                        "cidade":"${filtroService[i].cidade}",
                        "bairro":"${filtroService[i].bairro}",
                        "endereco":"${filtroService[i].endereco}",              
                        "enderecoNumero":"${filtroService[i].enderecoNumero}",
                        "email":"${filtroService[i].email}",
                        "fone":"${filtroService[i].fone}",
                        "celular":"${filtroService[i].celular}",
                        "contato":"${filtroService[i].contatos}",
                        "equipamentos":[${JSON.stringify(filtroService[i].equipamentos) == undefined? "" : JSON.stringify(filtroService[i].equipamentos)}],
                        "servicos":[${JSON.stringify(filtroService[i].servicos) == undefined? "" : JSON.stringify(filtroService[i].servicos)}],
                        "numeroSerie":"${filtroService[i].numeroSerie}",
                        "problema":"${filtroService[i].descricao_problema}",              
                        "observacao":"${filtroService[i].observacao}"
                      }
                      `
                      console.log(jsonData);
                                fetch(`http://localhost:3000/`, {
                                  method: 'POST',
                                  body: jsonData,
                                  headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                  }
                                }).then(res => res.json())
                                  .then(data => {
                                    console.log(`Adicionado serviço em dados.json: ${JSON.stringify(data)}`);
                                  })
                              } catch (error) {
                               if (error.toString().search("email")) {
                                console.log("e-mail falso");
                               } else {
                                error
                               }
                              }
                            })
                          
                      } catch (error) {
                        console.log(error);
                      } 
                    })                    
                       
                  } catch (error) {
                    console.log(error);
                  }
                })
            } catch (error) {
              console.log(error);
            }

          } else {
            console.log(`Nada a alterar: ${data[0].observacoes} é igual a ${filtroService[i].observacoes}`);
          }
        })
    } catch (error) {
console.log(error);
    }
  }
  for (let i = 0; i < filtroService.length; i++) {
    service(filtroService, i);
  }


})()
}

open()
setInterval(()=>{
  open()
},1800000)