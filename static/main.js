var i = 0;
var mostrar = 0 ;
var palavrasDesafioConvertida = [];
var palavrasDesafioConvertida2 = [];

const trigger = document.querySelector('.lupa');
var search = document.querySelector('#search');
var texto1 = document.querySelector('.texto1');
var texto2 = document.querySelector('.texto2');
var cardTopo = document.querySelector('.cardTopo');
var menuh = document.querySelector('.menuh');
var title = document.querySelectorAll('.title');
var menuLateral = document.querySelector('.menuLateral');
var cardFlashPort = document.querySelector('.cardFlashPort');
var cardFlashIng = document.querySelector('.cardFlashIng');
var mostrarTexto = document.querySelector('.exibir');
var cancel = document.querySelector('.cancel');
var certo = document.querySelector('.certo');
var input = document.querySelector('.input');
var rodape = document.querySelector('.rodape');
var trocarbaralho = document.querySelector('.trocarbaralho');
var fecharModal = document.querySelector('.fecharModal');
var modalContainer = document.querySelector('.modal-container');
var ulbaralho = document.querySelector('.ulbaralho');


const modal = document.querySelector("dialog")

texto1.addEventListener("click",()=> {
    if (mostrar == 0) {
        mostrar = 1;
        search.value = '';
        search.setAttribute('type', 'text');
    } else {
        mostrar = 0;
        search.setAttribute('type', 'hidden');
    }
})

mostrarTexto.addEventListener("click", exibir);
cardFlashIng.addEventListener("click", exibir);
//console.log(title)

function exibir(){
    texto2.style.display = 'block';
}


function menu() {
    document.querySelectorAll('.title').forEach(result => {
        //console.log(result.style.display)
        if (result.style.display == 'block') {
            result.style.display = 'none';
            menuLateral.style.width = '70px';
        } else {
            result.style.display = 'block';
            menuLateral.style.width = '300px';
        }
    })
}

menuh.addEventListener("click",(menu));

input.addEventListener("click", result => {
    i++ ;
    if (i == 6) {
        i = 0
        palavrasDesafioConvertida = palavrasDesafioConvertida2
    }        

    texto2.style.display = 'none'
    texto1.innerHTML = palavrasDesafioConvertida[i].flanguage1
    texto2.innerHTML = palavrasDesafioConvertida[i].flanguage2
    cardTopo.innerHTML = palavrasDesafioConvertida[i].baralho
    if (i == 5) {
        buscarDesafio2();
    }
});

async function buscarDesafio() {
    var palavrasDesafio = await fetch('/desafio')
    palavrasDesafioConvertida = await palavrasDesafio.json();
    console.log(palavrasDesafioConvertida);
    texto1.innerHTML = palavrasDesafioConvertida[0].flanguage1
    texto2.innerHTML = palavrasDesafioConvertida[0].flanguage2
    cardTopo.innerHTML = palavrasDesafioConvertida[i].baralho  
}

async function buscarDesafio2() {
    var palavrasDesafio = await fetch('/desafio')
    palavrasDesafioConvertida2 = await palavrasDesafio.json();
    console.log(palavrasDesafioConvertida2);
}

async function listarBaralhos() {
    var baralhos = await fetch('/listarbaralhos')
    baralhosConvertido = await baralhos.json();
    console.log(baralhosConvertido)
    //rodape.innerHTML = baralhosConvertido
    ulbaralho.innerHTML = '';
    for (let b = 0, len = baralhosConvertido.length; b < len; b++) {
        var novoLi = document.createElement("li");
        var texto = document.createTextNode(baralhosConvertido[b]);
        novoLi.appendChild(texto);
        ulbaralho.appendChild(novoLi);
    }
}

buscarDesafio()

function incluirPalavra(baralho) {
    // dados a serem enviados pela solicitação POST
    let data = {
        "baralho": baralho,
        "flanguage1": texto1.innerText, 
        "flanguage2": texto2.innerText
    }
    
    fetch('/incluirpalavra', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => console.log(json));
}

async function excluirPalavraTeste1() {
    var palavrasDesafio1 = await fetch('/outro')
    //console.log(palavrasDesafio);
    palavrasDesafioConvertida1 = await palavrasDesafio1.json();
    //console.log(palavrasDesafioConvertida1);
    rodape.innerHTML = palavrasDesafioConvertida[0].flanguage1
    //texto1.innerHTML = palavrasDesafioConvertida[0].flanguage1
    //texto2.innerHTML = palavrasDesafioConvertida[0].flanguage2
    //cardTopo.innerHTML = palavrasDesafioConvertida[i].baralho  
}

cancel.addEventListener("click", () => { 
    incluirPalavra("desconhecidas");
})

certo.addEventListener("click", () => { 
    incluirPalavra("conhecidas");
})



function abreModal() {
    listarBaralhos()        
    modal.showModal()      
}

function fechaModal() {
    modal.close()
}

fecharModal.addEventListener("click", () => {
    modal.close()
})

ulbaralho.addEventListener("click", function(e) {
    if (e.target.tagName === 'LI'){
        //alert(e.target.innerHTML);  // Check if the element is a LI
        // dados a serem enviados pela solicitação POST
        
        let data = {
            "baralhoPrincipal": e.target.innerHTML            
        }
        
        fetch('/trocarbaralho', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => document.location.reload(true))
        
    }
});

trocarbaralho.addEventListener("click", abreModal)
cardTopo.addEventListener("click", abreModal)