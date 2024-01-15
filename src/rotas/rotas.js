const { Router } = require('express')
const rotas = Router();
const controladores = require('../controladores/controladores');
const intermediarios = require('../intermediarios/intermediarios')

rotas.get('/contas', intermediarios.checarSenha, controladores.listarContas);
rotas.post('/contas', intermediarios.confirmarInformacoes, controladores.criarConta);
rotas.put('/contas/:numeroConta/usuario', intermediarios.confirmarInformacoes, controladores.atualizarConta);
rotas.delete('/contas/:numeroConta', controladores.deletarConta);
rotas.post('/transacoes/depositar', controladores.depositar);
rotas.post('/transacoes/sacar', intermediarios.validacoesDeSaque, controladores.sacar);
rotas.post('/transacoes/transferir', intermediarios.validacoesDeTransferencia, controladores.transferir);
rotas.get('/contas/saldo', intermediarios.validacoesDeExibicao, controladores.exibirSaldo)
rotas.get('/contas/extrato', intermediarios.validacoesDeExibicao, controladores.exibirExtrato)

module.exports = rotas;