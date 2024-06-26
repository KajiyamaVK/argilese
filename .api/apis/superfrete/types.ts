import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type AdicionarFreteCarrinhoBodyParam = FromSchema<typeof schemas.AdicionarFreteCarrinho.body>;
export type AdicionarFreteCarrinhoResponse200 = FromSchema<typeof schemas.AdicionarFreteCarrinho.response['200']>;
export type AdicionarFreteCarrinhoResponse400 = FromSchema<typeof schemas.AdicionarFreteCarrinho.response['400']>;
export type Apiintegrationv1CheckoutBodyParam = FromSchema<typeof schemas.Apiintegrationv1Checkout.body>;
export type Apiintegrationv1CheckoutResponse200 = FromSchema<typeof schemas.Apiintegrationv1Checkout.response['200']>;
export type Apiintegrationv1CheckoutResponse400 = FromSchema<typeof schemas.Apiintegrationv1Checkout.response['400']>;
export type CancelarPedidoBodyParam = FromSchema<typeof schemas.CancelarPedido.body>;
export type CancelarPedidoResponse200 = FromSchema<typeof schemas.CancelarPedido.response['200']>;
export type CancelarPedidoResponse400 = FromSchema<typeof schemas.CancelarPedido.response['400']>;
export type CotacaoDeFreteBodyParam = FromSchema<typeof schemas.CotacaoDeFrete.body>;
export type CotacaoDeFreteResponse200 = FromSchema<typeof schemas.CotacaoDeFrete.response['200']>;
export type CotacaoDeFreteResponse400 = FromSchema<typeof schemas.CotacaoDeFrete.response['400']>;
export type EnviarFreteParaASuperfreteCopyBodyParam = FromSchema<typeof schemas.EnviarFreteParaASuperfreteCopy.body>;
export type EnviarFreteParaASuperfreteCopyResponse200 = FromSchema<typeof schemas.EnviarFreteParaASuperfreteCopy.response['200']>;
export type EnviarFreteParaASuperfreteCopyResponse400 = FromSchema<typeof schemas.EnviarFreteParaASuperfreteCopy.response['400']>;
export type InformaEsDosPacotesResponse200 = FromSchema<typeof schemas.InformaEsDosPacotes.response['200']>;
export type InformaEsDosPacotesResponse400 = FromSchema<typeof schemas.InformaEsDosPacotes.response['400']>;
export type SolicitaODoTokenBodyParam = FromSchema<typeof schemas.SolicitaODoToken.body>;
export type SolicitaODoTokenResponse200 = FromSchema<typeof schemas.SolicitaODoToken.response['200']>;
export type SolicitaODoTokenResponse400 = FromSchema<typeof schemas.SolicitaODoToken.response['400']>;
export type SolicitaODoTokenResponse401 = FromSchema<typeof schemas.SolicitaODoToken.response['401']>;
export type SolicitaODoTokenResponse500 = FromSchema<typeof schemas.SolicitaODoToken.response['500']>;
export type TagInformaEsDoPedidoMetadataParam = FromSchema<typeof schemas.TagInformaEsDoPedido.metadata>;
export type TagInformaEsDoPedidoResponse200 = FromSchema<typeof schemas.TagInformaEsDoPedido.response['200']>;
export type TagInformaEsDoPedidoResponse400 = FromSchema<typeof schemas.TagInformaEsDoPedido.response['400']>;
export type TagLinkBodyParam = FromSchema<typeof schemas.TagLink.body>;
export type TagLinkResponse200 = FromSchema<typeof schemas.TagLink.response['200']>;
export type TagLinkResponse400 = FromSchema<typeof schemas.TagLink.response['400']>;
export type UserBuscarInformaEsDoUsuRioResponse200 = FromSchema<typeof schemas.UserBuscarInformaEsDoUsuRio.response['200']>;
export type UserBuscarInformaEsDoUsuRioResponse400 = FromSchema<typeof schemas.UserBuscarInformaEsDoUsuRio.response['400']>;
export type UserListarEndereOsResponse200 = FromSchema<typeof schemas.UserListarEndereOs.response['200']>;
export type UserListarEndereOsResponse400 = FromSchema<typeof schemas.UserListarEndereOs.response['400']>;
export type UserVerificarSaldoNaCarteiraResponse200 = FromSchema<typeof schemas.UserVerificarSaldoNaCarteira.response['200']>;
export type UserVerificarSaldoNaCarteiraResponse400 = FromSchema<typeof schemas.UserVerificarSaldoNaCarteira.response['400']>;
export type VerificarSePedidoCancelVelResponse200 = FromSchema<typeof schemas.VerificarSePedidoCancelVel.response['200']>;
export type VerificarSePedidoCancelVelResponse400 = FromSchema<typeof schemas.VerificarSePedidoCancelVel.response['400']>;
