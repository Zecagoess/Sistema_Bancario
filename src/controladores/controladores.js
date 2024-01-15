
const bancoDeDados = require('../bancodedados');
const data = new Date();
const hoje = data.toLocaleString();
let cliente = {}
let numero = 1;
let saldo = 0;
function buscarContaPorNumero(numeroConta) {
    return bancoDeDados.contas.find(conta => conta.numero == numeroConta);
}

//MAY GOD PROTECT YOU THROUGH THIS JOURNEY ARREAD

const listarContas = (req, res) => {
    try {
        res.status(200).json(bancoDeDados.contas);
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    }
};

const criarConta = (req, res) => {
    try {
        cliente = {
            numero,
            saldo,
            usuario: {
                ...req.body
            }
        };

        bancoDeDados.contas.push(cliente);
        numero++
        res.status(201).send();
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    }
};

const atualizarConta = (req, res) => {
    try {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const { numeroConta } = req.params;
        const contaEncontrada = buscarContaPorNumero(numeroConta)

        if (!contaEncontrada) {
            return res.status(404).json({ "mensagem": "Não existe conta para o numero informado." })
        } else {
            const novaConta = {
                numero: Number(numeroConta),
                saldo: contaEncontrada.saldo,
                usuario: {
                    nome,
                    cpf,
                    data_nascimento,
                    telefone,
                    email,
                    senha
                }
            };
            const indexDaContaEncontrada = bancoDeDados.contas.findIndex((conta) => {
                return conta.numero == numeroConta
            })
            bancoDeDados.contas.splice(indexDaContaEncontrada, 1, novaConta);
            res.status(204).send();
        };
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    }
};

const deletarConta = (req, res) => {
    try {
        const { numeroConta } = req.params;
        const contaEncontrada = buscarContaPorNumero(numeroConta)

        if (!contaEncontrada) {
            return res.status(404).json({ "mensagem": "Conta não existe" });
        }

        if (numeroConta) {
            if (isNaN(numeroConta)) {
                return res.status(400).json({ "mensagem": "Número da conta é inválido" });
            };
        };

        if (contaEncontrada.saldo !== 0) {
            return res.status(401).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
        };


        const indexDaContaEncontrada = bancoDeDados.contas.findIndex((conta) => {
            return conta.numero == numeroConta;
        });
        bancoDeDados.contas.splice(bancoDeDados.contas.indexOf(contaEncontrada), 1);
        // bancoDeDados.contas.splice(indexDaContaEncontrada, 1)[0];
        return res.status(204).send();
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    };
};

const depositar = (req, res) => {
    try {
        const { numero_conta, valor } = req.body;


        if (!numero_conta || !valor) {
            return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
        };

        const contaEncontrada = buscarContaPorNumero(numero_conta);

        if (!contaEncontrada) {
            return res.status(404).json({ "mensagem": "Não existe conta para o numero informado." });
        };

        if (valor <= 0) {
            res.status(400).json({ "mensagem": "O valor informado é invalido" });
        };

        contaEncontrada.saldo += Number(valor);

        const registro = {
            data: hoje,
            numero_conta,
            valor
        }
        bancoDeDados.depositos.push(registro);
        res.status(204).send();

    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    }


};

const sacar = (req, res) => {
    try {
        const { numero_conta, valor } = req.body;
        const contaEncontrada = buscarContaPorNumero(numero_conta);

        contaEncontrada.saldo -= valor;

        const registro = {
            data: hoje,
            numero_conta,
            valor
        }

        bancoDeDados.saques.push(registro);

        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    }
};

const transferir = (req, res) => {
    try {
        const { numero_conta_origem, numero_conta_destino, valor } = req.body;
        const contaDeOrigemEncontrada = buscarContaPorNumero(numero_conta_origem);
        const contaDeDestinoEncontrada = buscarContaPorNumero(numero_conta_destino);

        contaDeOrigemEncontrada.saldo -= valor;
        contaDeDestinoEncontrada.saldo += valor;

        const registro = {
            data: hoje,
            numero_conta_origem,
            numero_conta_destino,
            valor
        }

        bancoDeDados.transferencias.push(registro);

        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" })
    };
};

const exibirSaldo = (req, res) => {
    try {
        const { numero_conta } = req.query;
        const contaEncontrada = buscarContaPorNumero(numero_conta)

        return res.status(200).json(contaEncontrada.saldo);
    } catch (erro) {
        res.status(500).json({ "mensagem": "Internal Server Error" });
    };
};

const exibirExtrato = (req, res) => {
    try {
        const { saques, depositos, transferencias } = bancoDeDados;
        const { numero_conta, senha } = req.query;
        const contaEncontrada = buscarContaPorNumero(numero_conta);

        const extrato = {
            depositos: depositos.filter((deposito) => deposito.numero_conta == contaEncontrada.numero),
            saques: saques.filter((saque) => saque.numero_conta == contaEncontrada.numero),
            tranferenciasEnviadas: transferencias.filter((tranferencia) => tranferencia.numero_conta_origem == contaEncontrada.numero),
            transferenciasRecebidas: transferencias.filter((tranferencia) => tranferencia.numero_conta_destino == contaEncontrada.numero)
        }

        res.status(200).json(extrato);
    } catch (erro) {

        res.status(500).json({ "mensagem": "Internal Server Error" })
    };
};

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    exibirSaldo,
    exibirExtrato
}