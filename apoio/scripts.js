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
 * um elemento HTML <input type="file"> ou arrastando e soltando. Ele não pode ser usado para ler um 
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
const uploadBtn = document.getElementById("upload-btn")

/* Campo input que está oculto na tela */
const inputUpload = document.getElementById("input-upload")

/* Imagem que será alterada */
const imagemPrincipal = document.querySelector(".main-imagem")
const nomeDaImagem = document.querySelector("container-imagem-nome p")

/* Ao clicar no botão visível da tela, clicamos no input que está oculto na tela */
uploadBtn.addEventListener("click", () => {
  inputUpload.click()
});


/**
 * Função que irá ler o arquivo apontado pelo usuário
 * 
 * Temos como retorno a promessa (Promisse(...)) com dois tipos de retorno, sendo eles:
 * - resolve: Tudo aconteceu de forma correta (no FileReader())
 * - reject: Tivemos um problema no FileReader
 *  */
function lerConteudoDoArquivo(arquivo) {
  return new Promisse((resolve, reject) => {
    // O FileReader() é que define se iremos retornar resolve ou reject
    const leitor = new FileReader();

    console.log('b')

    // Caso a leitura (carregamento) do arquivo aconteça
    leitor.onload = () => {
      resolve({
        resultado: leitor.result, 
        nome: arquivo.name
      })
    }

    // Caso exista um erro na leitura do arquivo
    leitor.onerror = () => {
      reject(`Erro na leitura do arquivo ${arquivo.name}`)
    }

    // Ler os dados do arquivo de uma URL
    leitor.readAsDataURL(arquivo)
  })
}



/* Carregar a imagem na tela */
inputUpload.addEventListener('change', async (evento) => {
  // Arquivo que está sendo enviado
  const arquivo = evento.target.files[0]

  if (arquivo) {
    /* Verificar o tipo do arquivo */
    /*
    if (!arquivo.type.match('image/png') && !arquivo.type.match('image/jpeg')) {
      alert('Por favor, selecione uma imagem PNG ou JPEG.')
      return
    }
    */
  
    /* Limitar o tamanho da imagem para 2MB */
    /*
    if (arquivo.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
      return;
    }
   */

    try {
      console.log('try')
      const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);

      console.log('d')
      imagemPrincipal.src = conteudoDoArquivo.resultado;

      console.log('e')
      nomeDaImagem.textContent = conteudoDoArquivo.nome;
    } catch (erro) {
      console.error('Erro na leitura do arquivo');
    }
  }
});