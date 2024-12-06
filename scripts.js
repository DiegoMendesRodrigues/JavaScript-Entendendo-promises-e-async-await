/**
 * Promisse
 * -------------------
 * https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * 
 * Uma Promise é um proxy para um valor não necessariamente conhecido quando a promise é criada. 
 * Ele permite que você associe manipuladores ao valor de sucesso ou motivo de falha de uma 
 * ação assíncrona. 
 * Isso permite que métodos assíncronos retornem valores como métodos síncronos: em vez de 
 * retornar imediatamente o valor final, o método assíncrono retorna uma promise para fornecer 
 * o valor em algum momento no futuro.
 * 
 * 
 * FileReader()
 * -------------------
 * https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader
 * 
 * O objeto FileReader permite que aplicativos da web leiam de forma assíncrona o conteúdo de arquivos 
 * (ou buffers de dados brutos) armazenados no computador do usuário, usando File ou Blob objetos para 
 * especificar o arquivo ou dados a serem lidos.
 * 
 * Objetos de arquivo podem ser obtidos de um objeto FileList retornado como resultado de um usuário 
 * selecionar arquivos usando o elemento <input> ou de uma operação de arrastar e soltar 
 * DataTransfer objeto.
 * 
 * O FileReader só pode acessar o conteúdo dos arquivos que o usuário selecionou explicitamente, usando 
 * um elemento HTML <input type='file'> ou arrastando e soltando. Ele não pode ser usado para ler um 
 * arquivo por nome de caminho do sistema de arquivos do usuário. 
 * 
 * 
 * FileReader.readAsDataURL()
 * -------------------
 * https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader/readAsDataURL
 * 
 * O método readAsDataURL é usado para ler o conteúdo do tipo Blob ou File. Quando a operação de 
 * leitura acaba, a flag readyState muda para DONE e o evento loadend é disparado. Então o atributo 
 * result irá conter a URL codificada em base64 do arquivo.
 * 
 * instanceOfFileReader.readAsDataURL(blob);
 */

/* Botão 'Carregar imagem' que aparece na tela */
const uploadBtn = document.getElementById('upload-btn');

/* Campo input que está oculto na tela */
const inputUpload = document.getElementById('image-upload')

/* Imagem que será alterada */
const imagemPrincipal = document.querySelector('.main-imagem');

/* Nome da imagem que será alterada */
const nomeDaImagem = document.querySelector('.container-imagem-nome p');

/* Campo input das TAGs */
const inputTags = document.getElementById('input-tags')

/* Lista das TAGs */
const listaTags = document.getElementById('lista-tags')

/* Ao clicar no botão visível da tela, clicamos no input que está oculto na tela */
uploadBtn.addEventListener('click', () => {
    inputUpload.click()
})

/**
 * Função que irá ler o arquivo apontado pelo usuário
 * 
 * Temos como retorno a promessa (Promisse(...)) sendo ele de dois tipos:
 * - resolve: Tudo aconteceu de forma correta (no FileReader())
 * - reject: Tivemos um problema no FileReader
 */
function lerConteudoDoArquivo(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader()
        leitor.onload = () => {
            resolve({ url: leitor.result, nome: arquivo.name })
        }

        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo ${arquivo.name}`)
        }

        leitor.readAsDataURL(arquivo)
    })
}

/**
 * Quando acontecer uma alteração (mudança) no campo input que está oculto na tela,
 * a nova imagem será carregada para pré-visualização
 */
inputUpload.addEventListener('change', async (evento) => {
    const arquivo = evento.target.files[0]

    if (arquivo) {
        /* Verificar se o tipo do arquivo que está sendo enviado é correto */
        if (!arquivo.type.match('image/png') && !arquivo.type.match('image/jpeg')) {
            alert('Por favor, selecione uma imagem PNG ou JPEG')
            return
        }
        /* Limitar o tamanho da imagem para 2 MB */
        if (arquivo.size > 2 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 2 MB')
            return;
        }

        /* Carregar o arquivo da imagem */
        try {
            const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo)
            imagemPrincipal.src = conteudoDoArquivo.url
            nomeDaImagem.textContent = conteudoDoArquivo.nome
        } catch (erro) {
            console.error('Erro na leitura do arquivo')
        }
    }
})

/**
 * Quando o usuário final inserir uma nova Tag e pressionar ENTER, ela
 * será inserida na tela
 */
inputTags.addEventListener('keypress', async (evento) => {
    if (evento.key === 'Enter') {
        /**
         * Evitar o comportamento padrão de atualização da tela ao pressionar 'Enter', garantindo 
         * que não perderemos o que foi digitado no formulário
         */
        evento.preventDefault()

        const tagTexto = inputTags.value.trim()
        if (tagTexto !== '') {
            try {
                const tagExiste = await tagsDisponiveis.includes(tagTexto)
                if (tagExiste) {
                    /* Criar o novo elemento <li> com a tag */
                    const tagNova = document.createElement('li')
                    tagNova.innerHTML = `<p>${tagTexto}</p> <img src='./img/close-black.svg' width='10px' class='remove-tag'>`

                    /* Incluir o novo <li> na lista de tags <ul> */
                    listaTags.appendChild(tagNova)

                    /* Limpar o campo de digitação de tags */
                    inputTags.value = ''
                } else {
                    alert('Tag não encontrada. Por favor, insira uma tag válida.')
                }
            } catch (erro) {
                console.error('Erro ao verificar a existência da tag')
                alert('Erro ao verificar a existência da tag')
            }

        } else {
            alert('Tag não preenchida')
        }
    }
})

/**
 * Capturar os eventos do click na lista de tags, para remover uma delas da tela
 */
listaTags.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('remove-tag')) {
        /* Elemento pai da imagem é a tag <li> */
        const tagQueSeraRemovida = evento.target.parentElement

        listaTags.removeChild(tagQueSeraRemovida)
    }
})

/**
 * verificar se a tag digitada pelo usuário está entre as que podem ser utilziadas
 * Será utilizada uma função assíncrona com uma Promisse()
 */
const tagsDisponiveis = ['Front-end', 'Back-end', 'Full-stack', 'Programação', 'HTML', 'CSS',
    'JavaScript', 'TypeScript', 'PHP', 'Python', 'Java', 'Banco de dados', 'MySQL', 'PostgreSQL']

async function verificarTagsDisponiveis(tagTexto) {
    return new Promisse((resolve) => {
        setTimeout(() => {
            resolve(tagsDisponiveis.includes(tagTexto))
        }, 1000)
    })
}

/**
 * Validar o preenchimentos dos campos 'Nome do projeto', 'E-mail do gestor' e 'Descrição'
 * no formulario
 */
const botaoPublicar = document.querySelector('.botao-publicar')

botaoPublicar.addEventListener('click', async (evento) => {
    evento.preventDefault()

    const nome = document.getElementById('nome').value.trim()
    const emailGestor = document.getElementById('email-gestor').value.trim()
    const descricao = document.getElementById('descricao').value.trim()
    const tagsProjeto = Array.from(listaTags.querySelectorAll('p')).map((tag) => tag.textContent)

    const erroNome = document.getElementById('erro-nome')
    const erroEmailGestor = document.getElementById('erro-email-gestor')
    const erroDescricao = document.getElementById('erro-descricao')
    const erroTags = document.getElementById('erro-tags')

    /* Verificar se o nome foi preenchido */
    if (nome === '') {
        erroNome.textContent = 'O Nome do projeto é obrigatório'
        return
    } else {
        erroNome.textContent = ''
    }

    /* Verificar se o e-mail foi preenchido da forma correta */
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailGestor === '') {
        erroEmailGestor.textContent = 'O E-mail do gestor é obrigatório.';
        return
    } else if (!regexEmail.test(emailGestor)) {
        erroEmailGestor.textContent = 'O e-mail não é válido.';
        return
    } else {
        erroEmailGestor.textContent = '';
    }

    /* Verificar se a Descrição foi preenchida */
    if (descricao === '') {
        erroDescricao.textContent = 'A Descrição do projeto é obrigatória'
        return
    } else {
        erroDescricao.textContent = ''
    }

    /* Verificar se as tags foram preenchidas */
    if (!tagsProjeto.length) {
        erroTags.textContent = 'Pelo menos uma tag do projeto é obrigatória'
        return
    } else {
        erroTags.textContent = ''
    }

    /* Publicar o projeto */
    try {
        const mensagemPublicouProjeto = await publicarProjeto(nome, emailGestor, descricao, tagsProjeto)
        console.log(mensagemPublicouProjeto)
        alert(mensagemPublicouProjeto)
    } catch (erro) {
        console.error(erro)
        alert(erro)
    }
})

/**
 * Função para verificar se o e-mail do gestor preenchido não pertence a outro usuário
 */
async function verificarSeEmailEstaDisponivel(emailVerificado) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const emailsJaCadastrados = ['diego@fake.io', 'regina@fake.io', 'julia@fake.io']
            resolve(!emailsJaCadastrados.includes(emailVerificado))
        }, 1000)
    })
}

/**
 * Evento no campo de entrada de e-mail, que dispara a verificação quando o campo perde
 * o foco (evento blur)
 */
document.getElementById('email-gestor').addEventListener('blur', async (evento) => {
    const emailGestor = document.getElementById('email-gestor').value.trim()
    if (emailGestor) {
        try {
            const emailEstaDisponivel = await verificarSeEmailEstaDisponivel(emailGestor)
            exibirFeedback(emailEstaDisponivel, emailGestor)
        } catch (erro) {
            console.error(`Erro ao verificar  disponibilidade do e-mail: ${emailGestor}`)
            exibirFeedbackErro()
        }
    }
})

function exibirFeedback(disponivel, email) {
    const feedbackElemento = document.getElementById('email-feedback');
    if (disponivel) {
        feedbackElemento.textContent = `O e-mail ${email} está disponível!`;
        feedbackElemento.style.color = 'green';
    } else {
        feedbackElemento.textContent = `O e-mail ${email} já está cadastrado!`;
        feedbackElemento.style.color = 'red';
    }
}

function exibirFeedbackErro() {
    const feedbackElemento = document.getElementById('email-feedback');
    feedbackElemento.textContent = 'Erro ao verificar a disponibilidade do e-mail. Verifique o console.';
    feedbackElemento.style.color = 'red';
}

/**
 * Simular o envio das informações do formulário para o back-end
 */
async function publicarProjeto(nomeProjeto, emailGestor, descricaoProjeto, tagsProjeto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            /**
             * Aqui iremos definir, na sorte, se deu certo o envio das informações bara o
             * banco de dados do back-end
             */
            const publicacaoAconteceu = Math.random() > 0.3
            console.log('Verificar')

            if (publicacaoAconteceu) {
                resolve('Projeto publicado com sucesso!')
            } else {
                reject('Erro ao publicar o projeto!')
            }
        }, 2000)
    })
}

/**
 * Quando clicado o botão 'Descartar', é realizada uma limpeza no formulário
 */
const botaoDescartar = document.querySelector('.botao-descartar')
botaoDescartar.addEventListener('click', (evento) => {
    evento.preventDefault()

    const formulario = document.querySelector('form')
    formulario.reset()

    imagemPrincipal.src = './img/imagem1.png'
    nomeDaImagem.textContent = 'imagem_projeto.png'

    listaTags.innerHTML = ''

    const feedbackElemento = document.getElementById('email-feedback');
    feedbackElemento.textContent = ''
})