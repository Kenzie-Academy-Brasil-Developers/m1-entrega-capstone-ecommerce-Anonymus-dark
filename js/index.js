//colocar itens database de forma dinamica na vitrine

const vitrine = document.getElementById("sessãoVitrine")

function colocarItensVitrine ( produtos ) {
    
    const ul = document.createElement("ul")
    vitrine.appendChild(ul)

    for( let i in produtos ) {
        criarProdutos ( produtos[i], ul )
    }

}

function criarProdutos ( produtoBruto, ul ) {

    ul.insertAdjacentHTML(
        "beforeend", `
            <li class = "produtos" id = "${produtoBruto.id}">
                <figure>
                    <img src="${produtoBruto.img}" alt=${produtoBruto.nameItem}>
                </figure>
                <div>
                    <p class = "categoria">${produtoBruto.tag.join(", ")}</p>
                    <h2>${produtoBruto.nameItem}</h2>
                    <p class = "descricao">${produtoBruto.description}</p>
                    <p class = "valor">R$ ${produtoBruto.value}</p>
                    <button class = "button">${produtoBruto.addCart}</button>
                </div>
            </li>`
    )

}

colocarItensVitrine( data )

let quantidadeProdutos = 0
let somaValorProdutos = 0

    //zerar carrinho

const aside = document.getElementById("carrinhoCompras")

const resultadoCarrinho = document.getElementById("footerAside")

function zerarCarrinho () {

    quantidadeProdutos = 0
    somaValorProdutos = 0

    aside.classList.remove("carrinhoComItens")
    aside.classList.add("carrinhoVazio")

    aside.innerHTML = ""
    resultadoCarrinho.innerHTML = ""

    resultadoCarrinho.classList.remove("footerCarrinho")

    aside.insertAdjacentHTML(
        "beforeend", `
        <p class = "vazio">Carrinho vazio</p>
        <p class = "adicione">Adicione itens</p>`
        )

}

zerarCarrinho () 


    //pegar produto e colocar no carrinho
    
let arrCarrinho = []


vitrine.addEventListener("click", pegarId )

function pegarId ( e ) {
    
    if( e.target.className == "button"){

        let arr = ativarCarrinho()
        let produto = pegarProdutoNoData ( e.path[2].id)
        colocarNoArrCarrinho( produto )
        criarProdutoCarrinho( arrCarrinho )
        somaTotal( produto.value, arr )

    }

}

function colocarNoArrCarrinho ( produto ) {

    arrCarrinho.push( produto )
}

let arrBarraPesquisa = []

function pegarProdutoNoData ( id ) {

    for(let i in data){
        if( id == data[i].id ){
            return data[i]
        }
    }    
    

}

function ativarCarrinho () {

    if(aside.classList.contains("carrinhoVazio")){
        aside.innerHTML = ""

        resultadoCarrinho.insertAdjacentHTML(
            "beforeend", `
                <div class = "quantidade_total">
                    <p class = "negritoFooter">Quantidade:</p>
                    <p id = "quantidadeCompra">0</p>
                </div>
                <div class = "quantidade_total" >
                    <p class = "negritoFooter">Total:</p>
                    <p id = "totalCompra" >0</p>
                </div>`
            )


        resultadoCarrinho.classList.add("footerCarrinho")
    
        aside.classList.remove("carrinhoVazio")
        aside.classList.add("carrinhoComItens")

    }

    const quantidadeCompra = document.getElementById("quantidadeCompra")

    const totalCompra = document.getElementById("totalCompra")

    return [totalCompra, quantidadeCompra]
}

function criarProdutoCarrinho ( produtoArr ) {

    aside.innerHTML = ""

    const lista = document.createElement("ul")
    aside.appendChild(lista)
    lista.id = "existe"
 

    for( let i in produtoArr ){

        lista.insertAdjacentHTML(
            "beforeend", `
                <li class = "carrinhoItens" id = ${produtoArr[i].id}>
                    <figure>
                        <img src = "${produtoArr[i].img}" alt = ${produtoArr[i].nameItem}>
                    </figure>
                    <div>
                        <h2>${produtoArr[i].nameItem}</h2>
                        <p>R$ ${produtoArr[i].value}</p>
                        <button>Remover Produto</button>
                    </div>
                </li>
            `
        )
    }

}

function somaTotal ( valor, arrP ) {

    somaValorProdutos += valor
    quantidadeProdutos++

    arrP[0].innerHTML = `R$ ${somaValorProdutos}`
    arrP[1].innerHTML = quantidadeProdutos


}

    //remover produto e subtrair valor total, e quantidade

aside.addEventListener("click", removerProduto )

function removerProduto ( e ) {

    if( e.target.innerHTML == "Remover Produto" ){

        retirarProdutoCarrinhoEZerar( arrCarrinho, e.path[2].id )

    }   
}

function retirarProdutoCarrinhoEZerar ( carrinho, id ) {
    let idNumber = Number( id )

    for( let i in carrinho ){

        if( carrinho[i].id == idNumber ){

            subtrairValor( carrinho[i].value )
            subtrairQuantidade()
            carrinho.splice( i, 1 )
            criarProdutoCarrinho( carrinho )
            break
        }
    }
    if( carrinho.length === 0 ){
        zerarCarrinho ()
    }

}

function subtrairValor ( valor ) {

    somaValorProdutos -= valor

    const totalCompra = document.getElementById("totalCompra")

    totalCompra.innerHTML = `R$ ${somaValorProdutos}`

}

function subtrairQuantidade () {

    quantidadeProdutos -= 1

    const quantidadeCompra = document.getElementById("quantidadeCompra")

    quantidadeCompra.innerHTML = quantidadeProdutos

}

    //barra pesquisa
 

const botao_pesquisa = document.getElementById("pesquisar")

const inputPesquisa = document.getElementById("inputPesquisa")

botao_pesquisa.addEventListener("click", verificarConteudoEntrada )

function verificarConteudoEntrada ( e ) {
    
    verificarEntradaVazia()
    verificarEntradaTemConteudo()

}

function verificarEntradaVazia () {
    
    if( inputPesquisa.value == "" ){

        vitrine.innerHTML   = ""
        colocarItensVitrine ( data )

    }
}

function verificarEntradaTemConteudo () {
    
    if( inputPesquisa.value !== "" ){

        let nomeTratado = tratamentoEntrada ( inputPesquisa.value )

        colocarNoArr ( data, nomeTratado )

        renderiarVitrine ( arrBarraPesquisa )
    }
}

function colocarNoArr ( data, nomeInserido ) {

    for( let i in data ){

        if( data[i].nameItem.toLowerCase() == nomeInserido || data[i].tag[0].toLowerCase() == nomeInserido ){
            arrBarraPesquisa.push( data[i] )
        }

    }

}

function renderiarVitrine ( arrPesquisa ) {

    vitrine.innerHTML = ""
    arrBarraPesquisa = []

    colocarItensVitrine ( arrPesquisa )

}

    //tratamento entrada

function tratamentoEntrada ( nome ) {

    nome = nome.toLowerCase().trim()

    let teste1 = acessorios( nome )

    let teste2 = jaquetas( teste1 )

    let teste3 = camisetas( teste2 )

    let teste4 = moleton( teste3 )

    return teste4
}

function acessorios ( nome ) {

    let acessorio = ["acessorios", "acessorio", "acesorio","asessorio","asesorio"]

    for(let i = 0; i < acessorio.length ; i++){

        if( nome == acessorio[i]){
            return "acessórios"
        }
    }

    return nome
}

function jaquetas ( nome ) {

    let jaqueta = ["jaqueta", "jaquetas", "jegueta", "jaguetas"]

    for(let i = 0; i < jaqueta.length ; i++){

        if( nome == jaqueta[i]){
            return "jaquetas"
        }
    }

    return nome
}

function camisetas ( nome ) {
    
    let camiseta = ["camiseta", "camisetas", "camisa", "camisas"]

    for(let i = 0; i < camiseta.length ; i++){

        if( nome == camiseta[i]){
            return "camisetas"
        }
    }

    return nome
}

function moleton ( nome ) {
    
    let moleton = ["moleton", "moletons", "blusa", "blusas"]

    for(let i = 0; i < moleton.length ; i++){

        if( nome == moleton[i]){
            return "moleton"
        }
    }

    return nome
}

    //botoes cabecario

const navegacao = document.getElementById("navegacao")

navegacao.addEventListener("click", trazerCategoria )

function trazerCategoria ( e ) {

    mostrarTodos( e.target.innerHTML, data )
    
    if( e.target.innerHTML !== "Todos" ){
        
        let nomeTratado = tratamentoEntrada ( e.target.innerHTML )

        colocarNoArr ( data, nomeTratado )

        renderiarVitrine ( arrBarraPesquisa )
    }

}

function mostrarTodos ( name, data ) {

        console.log( name == "Todos")
    if( name == "Todos" ){

        vitrine.innerHTML   = ""
        colocarItensVitrine( data )
    }

}