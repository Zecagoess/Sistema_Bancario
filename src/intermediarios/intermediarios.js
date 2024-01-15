const bancoDeDados = require('../bancodedados');
const senha = 'Cubos123Bank';
function buscarContaPorNumero(numeroConta) {
    return bancoDeDados.contas.find(conta => conta.numero == numeroConta);
}

const checarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        res.status(400).json({ "mensagem": "Por favor, informe a senha" });
    };

    if (senha_banco !== senha) {
        res.status(401).json({ "mensagem": "A senha do banco informada é inválida!" });
    };

    next();
};

const confirmarInformacoes = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = Number(req.params);

    if (numeroConta) {
        if (isNaN(numeroConta)) {
            return res.status(400).json({ "mensagem": "Número da conta é inválido" });
        };
    };
    if (!nome) {
        return res.status(400).json({ "mensagem": "Por favor, informe o seu nome" });
    };
    if (!cpf) {
        return res.status(400).json({ "mensagem": "Por favor, informe o seu CPF" });
    };
    if (!data_nascimento) {
        return res.status(400).json({ "mensagem": "Por favor, informe a sua data de nascimento" });
    };
    if (!telefone) {
        return res.status(400).json({ "mensagem": "Por favor, informe o seu telefone" });
    };
    if (!email) {
        return res.status(400).json({ "mensagem": "Por favor, informe o seu e-mail" });
    };
    if (!senha) {
        return res.status(400).json({ "mensagem": "Por favor, informe uma senha válida" });
    };

    const cpfExistente = bancoDeDados.contas.some(conta => conta.usuario.cpf === cpf);
    const emailExistente = bancoDeDados.contas.some(conta => conta.usuario.email === email);

    if (cpfExistente) {
        return res.status(400).json({ "mensagem": "O CPF informado já existe cadastrado!" });
    };
    if (emailExistente) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    };
    next();
};

const validacoesDeSaque = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;
    if (!numero_conta) {
        return res.status(400).json({ "mensagem": "Por favor, informe o número da conta" });
    };
    if (!valor) {
        return res.status(400).json({ "mensagem": "Por favor, informe o valor" });
    };
    if (!senha) {
        return res.status(401).json({ "mensagem": "Por favor, informe a senha" });
    };

    const contaEncontrada = buscarContaPorNumero(numero_conta);

    if (!contaEncontrada) {
        return res.status(404).json({ "mensagem": "Não existe conta para o numero informado." });
    };

    if (senha !== contaEncontrada.usuario.senha) {
        return res.status(401).json({ "mensagem": "a senha informada não é válida" });
    };

    if (contaEncontrada.saldo - valor < 0) {
        return res.status(401).json({ "mesangem": "saldo insuficiente" });
    };
    next();
}

const validacoesDeTransferencia = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({ "mensagem": "Por favor, informe a conta de origem" });
    };
    if (!numero_conta_destino) {
        return res.status(400).json({ "mensagem": "Por favor, informe a conta de destino" });
    };
    if (!valor) {
        return res.status(400).json({ "mensagem": "Por favor, informe o valor" });
    };
    if (!senha) {
        return res.status(400).json({ "mensagem": "Por favor, informe a senha" });
    };

    const contaDeOrigemEncontrada = buscarContaPorNumero(numero_conta_origem);
    const contaDeDestinoEncontrada = buscarContaPorNumero(numero_conta_destino);

    if (!contaDeDestinoEncontrada || !contaDeOrigemEncontrada) {
        return res.status(404).json({ "mensagem": "conta de origem ou de destino não encontrada" });
    };

    if (contaDeOrigemEncontrada.usuario.senha !== senha) {
        return res.status(401).json({ "mensagem": "A senha informada não é válida" });
    };

    if (contaDeOrigemEncontrada.saldo < valor) {
        return res.status(401).json({ "mesangem": "saldo insuficiente" });
    }

    next();
}

const validacoesDeExibicao = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!senha) {
        return res.status(400).json({ "mensagem": "Por favor informe a Senha" });
    };
    if (!numero_conta) {
        return res.status(400).json({ "mensagem": "Por favor informe o número da conta" });
    };

    const contaEncontrada = buscarContaPorNumero(numero_conta);

    if (!contaEncontrada) {
        return res.status(404).json({ "mensagem": "Não existe conta para o numero informado." });
    };

    if (senha !== contaEncontrada.usuario.senha) {
        return res.status(401).json({ "mensagem": "a senha informada não é válida" });
    };

    next();
};

module.exports = {
    checarSenha,
    confirmarInformacoes,
    validacoesDeSaque,
    validacoesDeTransferencia,
    validacoesDeExibicao
}

//WHEN I WROTE THIS ONLY GOD AND I UNDERSTOOD WHAT I WAS DOING
//NOW, ONLY GOD KNOWS