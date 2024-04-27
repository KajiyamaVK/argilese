interface IAfterPurchaseEmail {
  name: string
  order: string
}

export function AfterPurchaseEmailHTML({ name, order }: IAfterPurchaseEmail) {
  return `<html>
<head>
    <title>Argile-se - Compra aprovada</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..800&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .header {
      width: 100%;
      background-color: #ffedd5;
      padding-top: 20px;
      padding-bottom: 20px;
    }

    h1,h2,h3{
      font-family: 'Baloo 2', cursive;
      font-size: 24px;
      color: #1f1f1f;
    }

    p,b {
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      color: #1f1f1f;
    }

    .content {
        width: 100%;
        
        padding: 20px;
      }
    @media  (max-width: 320px) {


      

      
    }
  </style>

</head>
<body style="flex flex-col">
  <div style="max-width: 46.15rem;  margin-left: auto; margin-right: auto; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); height:100vh">
    
    <div class="header">
      <div style="display: flex; gap: 20px; align-items: center;">
        <img alt="Logo da Argilese com um sol e um cachorro de orelhas longas, caramelo" style="width: 50; height: auto; margin-left: 20px;" src="https://www.argilesestudio.com.br/topbar_logo.png">
        <h1>Argile-se</h1>
      </div>
    </div>

    <div class="content" style="display: flex; flex-direction: column; ">
      <img src="https://argilesestudio.com.br/mariana1.png" alt="" style="width:200px; height: auto; margin-left: auto; margin-right: auto; position: relative;"/>
      <h2 style="margin-bottom: 20px;">Olá, ${name}! </h2>
      <p>Primeiramente, muito obrigada pela sua compra.</p><br/>
      <p>Isso representa para mim não apenas um ganho financeiro, mas um apoio ao carinho e empenho que tenho em cada uma das pecinhas. Deus te abençoe.</p><br/>

      <p>Logo abaixo está o número da venda. Ela é importante para qualquer suporte referente a essa venda:</p><br/>

      <div style="display: flex;">
        <b>Nº da venda: </b> ${order} <br/>
      </div>

      <div style="background-color: rgb(207, 71, 71); margin-top: 20px; padding: 10px;">
        <b style="color: white;">Importante</b>
        <p style="color: white; margin-top: 20px;">O <b style="color: white;">código de rastreio</b> será enviado por e-mail após o despacho da mercadoria</p>
      </div>

    </div>
  </div>
</body>
</html>`
}
