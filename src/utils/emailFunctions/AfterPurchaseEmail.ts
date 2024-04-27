interface IAfterPurchaseEmail {
  name: string
  order: string
}

export function AfterPurchaseEmailHTML({ name, order }: IAfterPurchaseEmail) {
  return `
<html>
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

    body, p, h1, h2, h3, b {
      color: #1f1f1f;
      margin: 0;
      padding: 0;
  }

  h1, h2 {
      font-family: 'Baloo 2', cursive;
  }

  p,b {
      font-family: 'Roboto', sans-serif;
  }

  .header {
      background-color: #ffedd5;
      padding: 20px 0;
      text-align: center;
  }
  .content {
      padding: 20px;
      text-align: left;
  }
  .important {
      background-color: rgb(207, 71, 71);
      padding: 10px;
      margin-top: 20px;
  }
  </style>

</head>
<body style="width: 600px;margin-left: auto; margin-right: auto;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td class="header">
                <table align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-right: 20px;">
                            <img src="https://www.argilesestudio.com.br/topbar_logo.png" alt="Logo da Argilese com um sol e um cachorro de orelhas longas, caramelo" width="50" height="auto">
                        </td>
                        <td>
                            <h1>Argile-se</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="content">
                <img src="https://argilesestudio.com.br/mariana1.png" alt="" style="width:200px; height: auto; margin: auto; display: block;"/>
            </td>
        </tr>
    </table>
    <div style="margin:20px">
      <h2>Olá, ${name}!</h2>
      <p>Primeiramente, muito obrigada pela sua compra.</p>
      <p>Isso representa para mim não apenas um ganho financeiro, mas um apoio ao carinho e empenho que tenho em cada uma das pecinhas. Deus te abençoe.</p>
      <p>Logo abaixo está o número da venda. Ela é importante para qualquer suporte referente a essa venda:</p>
      <p><b>Nº da venda: </b> ${order}</p>
      <div class="important">
        <b style="color: #fff;">Importante</b>
        <p style="color: #fff;">O <b style="color: #fff;">código de rastreio</b> será enviado após o envio da mercadoria.</p>
      </div>
    </div>

</body>
</html>`
}
