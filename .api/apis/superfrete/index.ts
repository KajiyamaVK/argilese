import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'superfrete/unknown (api/6.1.1)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Cotação de frete
   *
   * @throws FetchError<400, types.CotacaoDeFreteResponse400> 400
   */
  cotacaoDeFrete(body: types.CotacaoDeFreteBodyParam): Promise<FetchResponse<200, types.CotacaoDeFreteResponse200>> {
    return this.core.fetch('/api/v0/calculator', 'post', body);
  }

  /**
   * Enviar Frete para a SuperFrete
   *
   * @throws FetchError<400, types.AdicionarFreteCarrinhoResponse400> 400
   */
  adicionarFreteCarrinho(body: types.AdicionarFreteCarrinhoBodyParam): Promise<FetchResponse<200, types.AdicionarFreteCarrinhoResponse200>> {
    return this.core.fetch('/api/v0/cart', 'post', body);
  }

  /**
   * Finalizar pedido e gerar etiqueta
   *
   * @throws FetchError<400, types.Apiintegrationv1CheckoutResponse400> 400
   */
  apiintegrationv1checkout(body: types.Apiintegrationv1CheckoutBodyParam): Promise<FetchResponse<200, types.Apiintegrationv1CheckoutResponse200>> {
    return this.core.fetch('/api/v0/checkout', 'post', body);
  }

  /**
   * Cancelar pedido
   *
   * @throws FetchError<400, types.CancelarPedidoResponse400> 400
   */
  cancelarPedido(body?: types.CancelarPedidoBodyParam): Promise<FetchResponse<200, types.CancelarPedidoResponse200>> {
    return this.core.fetch('/api/v0/order/cancel', 'post', body);
  }

  /**
   * Informações do pedido
   *
   * @throws FetchError<400, types.TagInformaEsDoPedidoResponse400> 400
   */
  tagInformaEsDoPedido(metadata: types.TagInformaEsDoPedidoMetadataParam): Promise<FetchResponse<200, types.TagInformaEsDoPedidoResponse200>> {
    return this.core.fetch('/api/v0/order/info/{id}', 'get', metadata);
  }

  /**
   * Link para impressão da etiqueta
   *
   * @throws FetchError<400, types.TagLinkResponse400> 400
   */
  tagLink(body?: types.TagLinkBodyParam): Promise<FetchResponse<200, types.TagLinkResponse200>> {
    return this.core.fetch('/api/v0/tag/print', 'post', body);
  }

  /**
   * Listar endereços
   *
   * @throws FetchError<400, types.UserListarEndereOsResponse400> 400
   */
  userListarEndereOs(): Promise<FetchResponse<200, types.UserListarEndereOsResponse200>> {
    return this.core.fetch('/api/v0/user/addresses', 'get');
  }

  /**
   * Verificar saldo na carteira
   *
   * @throws FetchError<400, types.UserVerificarSaldoNaCarteiraResponse400> 400
   */
  userVerificarSaldoNaCarteira(): Promise<FetchResponse<200, types.UserVerificarSaldoNaCarteiraResponse200>> {
    return this.core.fetch('/api/v0/user/balance', 'get');
  }

  /**
   * Buscar informações do usuário
   *
   * @throws FetchError<400, types.UserBuscarInformaEsDoUsuRioResponse400> 400
   */
  userBuscarInformaEsDoUsuRio(): Promise<FetchResponse<200, types.UserBuscarInformaEsDoUsuRioResponse200>> {
    return this.core.fetch('/api/v0/user', 'get');
  }

  /**
   * Verificar se pedido é cancelável
   *
   * @throws FetchError<400, types.VerificarSePedidoCancelVelResponse400> 400
   */
  verificarSePedidoCancelVel(): Promise<FetchResponse<200, types.VerificarSePedidoCancelVelResponse200>> {
    return this.core.fetch('/api/v0/order/cancellable', 'post');
  }

  /**
   * Enviar Frete para a SuperFrete (COPY)
   *
   * @throws FetchError<400, types.EnviarFreteParaASuperfreteCopyResponse400> 400
   */
  enviarFreteParaASuperfreteCopy(body: types.EnviarFreteParaASuperfreteCopyBodyParam): Promise<FetchResponse<200, types.EnviarFreteParaASuperfreteCopyResponse200>> {
    return this.core.fetch('/api/v0/cart (COPY)', 'post', body);
  }

  /**
   * Solicitação do token
   *
   * @throws FetchError<400, types.SolicitaODoTokenResponse400> 400
   * @throws FetchError<401, types.SolicitaODoTokenResponse401> 401
   * @throws FetchError<500, types.SolicitaODoTokenResponse500> 500
   */
  solicitaODoToken(body: types.SolicitaODoTokenBodyParam): Promise<FetchResponse<200, types.SolicitaODoTokenResponse200>> {
    return this.core.fetch('/api/v0/oauth/token', 'post', body);
  }

  /**
   * Informações dos pacotes
   *
   * @throws FetchError<400, types.InformaEsDosPacotesResponse400> 400
   */
  informaEsDosPacotes(): Promise<FetchResponse<200, types.InformaEsDosPacotesResponse200>> {
    return this.core.fetch('/api/v0/services/info', 'get');
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { AdicionarFreteCarrinhoBodyParam, AdicionarFreteCarrinhoResponse200, AdicionarFreteCarrinhoResponse400, Apiintegrationv1CheckoutBodyParam, Apiintegrationv1CheckoutResponse200, Apiintegrationv1CheckoutResponse400, CancelarPedidoBodyParam, CancelarPedidoResponse200, CancelarPedidoResponse400, CotacaoDeFreteBodyParam, CotacaoDeFreteResponse200, CotacaoDeFreteResponse400, EnviarFreteParaASuperfreteCopyBodyParam, EnviarFreteParaASuperfreteCopyResponse200, EnviarFreteParaASuperfreteCopyResponse400, InformaEsDosPacotesResponse200, InformaEsDosPacotesResponse400, SolicitaODoTokenBodyParam, SolicitaODoTokenResponse200, SolicitaODoTokenResponse400, SolicitaODoTokenResponse401, SolicitaODoTokenResponse500, TagInformaEsDoPedidoMetadataParam, TagInformaEsDoPedidoResponse200, TagInformaEsDoPedidoResponse400, TagLinkBodyParam, TagLinkResponse200, TagLinkResponse400, UserBuscarInformaEsDoUsuRioResponse200, UserBuscarInformaEsDoUsuRioResponse400, UserListarEndereOsResponse200, UserListarEndereOsResponse400, UserVerificarSaldoNaCarteiraResponse200, UserVerificarSaldoNaCarteiraResponse400, VerificarSePedidoCancelVelResponse200, VerificarSePedidoCancelVelResponse400 } from './types';
