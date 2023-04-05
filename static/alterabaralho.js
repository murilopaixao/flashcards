var rodape = document.querySelector('.rodape');
var radios = document.getElementsByName("tipoinclusao");
var radio = document.querySelector(".radio");
var unitario = document.querySelector(".unitario");
var message = document.querySelector(".message");

function checarRadio() {
    console.log(radios[0].value)
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked === true) {            
            
            switch(radios[i].value) {
                case "unit":
                    unitario.style.display = 'block';
                    message.style.display = 'none';
                    break;
                case "multiplo": 
                    message.style.display = 'block';
                    unitario.style.display = 'none';
                    break;
            }
        }
    }
}

radio.addEventListener("click", checarRadio);

function teste() {
    //document.getElementsByName("message").value = "Teste atribuição"
    var x = document.getElementById("myTextarea").value
    rodape.innerHTML = x ;
    //console.log(document.getElementsByName("message").value);
}

rodape.addEventListener("click", teste);