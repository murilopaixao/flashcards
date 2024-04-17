from flask import render_template, request, redirect, url_for, jsonify, make_response
from app import app
import json
import pymongo
from bson.objectid import ObjectId
from bson.json_util import dumps
from os import getenv

DB_SCHEME = getenv('DB_SCHEME')
DB_HOST = getenv('DB_HOST')
DB_LOGIN = getenv('DB_LOGIN')
DB_PASSWORD = getenv('DB_PASSWORD')
DB_PORT = getenv('DB_PORT')


conn_str = (f"{DB_SCHEME}://{DB_LOGIN}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}")

try:
    client = pymongo.MongoClient(conn_str)
except Exception:
    print("Error:" + Exception)

myDB = client["flashcards"]


myCollection = myDB["baralhos"]

@app.route('/')
def index():    
    lista = myCollection.aggregate([ {"$match": {"baralho":"main"}}, { "$sample": { "size": 5 }}])
    config = myCollection.find_one({"config": "baralho"},{"_id": 0, "baralhoPrincipal": 1})
    if (config == None):
        print("--- sem retorno ---")
        with open("baralhos.json", encoding='utf-8') as cargaInicial:
            dados = json.load(cargaInicial)
        myCollection.insert_many(dados)
        myDoc = {
                "config": "baralho",
                "baralhoPrincipal": "100PalavrasMaisComuns"                
            }
        myCollection.insert_one(myDoc)
    
    return render_template('index.html', subTitulo='Projetos', lista=lista, config=config)

@app.route('/baralhos/<baralhop>')
@app.route('/baralhos', defaults={"baralhop": "none"})
def baralhos(baralhop):
        lista = myCollection.distinct("baralho")
        lista1 = []
        contadores = {}
        for baralho in lista:
            #print(baralho)
            subTotal = myCollection.count_documents({"baralho": baralho})
            contadores = {"baralho": baralho, "subTotal": subTotal}
            lista1.append(contadores)
        detalhado = ""
        if (baralhop != "none"):
            detalhado = myCollection.find({"baralho": baralhop}).sort("flanguage1", 1)

        return render_template('baralhos.html', subTitulo='Baralhos', lista=lista1, detalhado=detalhado, baralhop=baralhop)

@app.route('/addcard', methods=['POST',])
def addcard():
    baralho = request.form['baralho'].strip()
    flanguage1 = request.form['flanguage1'].strip()
    flanguage2 = request.form['flanguage2'].strip()
    tipoinclusao = request.form['tipoinclusao'].strip()
    message = request.form['message'].strip()

    print(tipoinclusao)
    if (tipoinclusao == "unit"):
        print("If unitario")
        if (baralho == "" or flanguage1 == "" or flanguage2 == ""):
            print("Em branco")
        else:
            myDoc = {
                "baralho": baralho,
                "flanguage1": flanguage1,
                "flanguage2": flanguage2
            }
            if (myCollection.count_documents({"baralho": baralho, "flanguage1": flanguage1})) == 0:
                myCollection.insert_one(myDoc)
                return redirect('/alterabaralho')
            else:
                print("Já existe")
                return redirect('/alterabaralho')
    else:
        print("Else multiplo 2 colunas")
        mult = message.split("\n")
        print(type(mult))
        cont = 0
        for j in mult:            
            #print("Mult : " + j.strip())
            #print(j.strip())
            word = j.strip().split(";")
            print("["+word[0].strip()+"]")
            print("["+word[1].strip()+"]")
            myDoc = {
                "baralho": baralho,
                "flanguage1": word[0].strip().lower(),
                "flanguage2": word[1].strip().lower()
            }
            if (myCollection.count_documents({"baralho": baralho, "flanguage1": word[0].strip().lower()})) == 0:
                myCollection.insert_one(myDoc)
                cont += 1
            else:
                print("Já existe - modo de inclusão multipla")           

    print("Total de intens incluidos: " + str(cont))
    return redirect('/alterabaralho')        

@app.route('/desafio', methods=['GET'])
def desafio():
    config = myCollection.find_one({"config": "baralho"},{"_id": 0, "baralhoPrincipal": 1})
    baralho = config["baralhoPrincipal"]

    lista = myCollection.aggregate([{"$match": {"baralho": baralho}}, { "$sample": { "size": 10 }}])
    lista2 = []
    check = {}
    for item in lista:
        if (myCollection.count_documents({"baralho": "conhecidas", "flanguage1": item["flanguage1"]})) == 0:
            conhecida = "false"
        else:
            conhecida = "true"        
        check = {"baralho": baralho, "flanguage1": item["flanguage1"], "flanguage2": item["flanguage2"], "conhecida": conhecida}
        lista2.append(check)

    return dumps(lista2)

@app.route('/outro', methods=['GET'])
def outro():    
    lista = myCollection.aggregate([ {"$match": {"baralho":"main"}}, { "$sample": { "size": 6 }}])
    #lista = myCollection.find({"baralho": "50AdjetivosMaisComuns"})
    print(lista)
    return jsonify(dumps(lista))


@app.route('/trocarbaralho', methods=['POST'])
def trocarbaralho():
    json = request.json
    print(json["baralhoPrincipal"])
    
    myCollection.update_one({"config": "baralho"},{"$set": {"baralhoPrincipal": json["baralhoPrincipal"] }})
    return json


@app.route('/alterabaralho')
def alterabaralho():
    return render_template('alterabaralho.html', subTitulo='Baralhos')

@app.route('/listarbaralhos')
def listarbaralhos():
    lista = myCollection.distinct("baralho")
    return dumps(lista)

@app.route('/incluirpalavra', methods=['POST'])
def incluirpalavra():
    if request.method == 'POST':           
        content_type = request.headers.get('Content-Type')
        #print(content_type)
        if ( "application/json" in content_type):
            #print("Entrei IF content_type:")
            json = request.json
            print(json)
            #print(json["baralho"])
            #print(json["flanguage1"])

            if (myCollection.count_documents({"baralho": json["baralho"], "flanguage1": json["flanguage1"]})) == 0:
                result = myCollection.insert_one(json)
                return str(result)
            else:
                print("Registro já consta na base de dados")
                consta = ("[{'registro': 'Existente na base'}]")
                return dumps(consta)
        else:
            #return 'Content-Type not supported!'
            return str(result)
        
@app.route('/frases')
def frases():
    
    return render_template('frases.html', subTitulo='Frases')
