var filmsInfo = [];

async function loadPage() {
    await loadData();
    setTimeout(paintFilms, 5000);
}

//hacer peticion a la api con fetch
const loadData = () => {
    fetch('http://swapi.py4e.com/api/films/').then(function(response) {
            //console.log(response)
            return response.json(); //convertir a json el resultado de la peticion
        })
        .then(function(data) { //una vez obteniendo respuesta, acceder a su data
            let dataFilms = data.results
                //console.log(dataFilms);
            films(dataFilms);
        })
        .catch(function(error) { //mensaje en caso de no tener exito en la peticion
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
}


//funcion para acceder a los datos que se requieren de la data extraida
const films = (dataFilms) => {
    dataFilms.forEach(function(element, index) {
        //console.log(element)
        let film = {};
        let imagesArray = ["./assets/images/a-new-hope.jpg", "./assets/images/attack-of-the-clones.jpg", "./assets/images/the-phantom-menace.jpg", "./assets/images/revenge-of-the-sith.jpg", "./assets/images/return-of-the-jedi.jpg", "./assets/images/the-empire-strikes-back.jpg", "./assets/images/the-force-awakens.jpg"]
        film.indexImage = imagesArray[index];
        film.title = element.title;
        film.episode = element.episode_id;
        let people = element.characters;

        filmsInfo.push(film);
        people.forEach(async function(character) {
            await findCharacters(character, film.episode);
        })

    });

};

const findCharacters = (url, episode) => {
    fetch(url).then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let findFilm = filmsInfo.find(x => x.episode === episode);
            if (findFilm) {
                if (!findFilm.characters) {
                    findFilm.characters = [];
                }
                //findFilm.characters = [];
                let infoCharacter = {}
                infoCharacter.url = url;
                infoCharacter.Character = data.name;
                findFilm.characters.push(infoCharacter);
            }
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
};

async function paintFilms() {

    filmsInfo.forEach(function(film) {

        let templatePeople = '';
        film.characters.forEach(function(chracter) {
            templatePeople += `<a id="card-people" linkReference='${chracter.url}' class="card-people"  href="#modal" data-toggle="modal"><li>${chracter.Character}</li></a>`;
        });

        let template = `<div class="card-group col-md-4">
       <div class="card">
                <img class="card-img-top" src=${film.indexImage} alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${film.title}</h5>
                    <p class="card-text">${film.episode}</p>
                    <ul>${templatePeople}</ul>
                </div>
            </div>
        </div>`

        let sectionFilms = document.getElementById("row");
        sectionFilms.innerHTML += template;
    });

    //let linksHTML = document.querySelectorAll("[linkReference]");
    let linksHTML = document.getElementsByClassName("card-people"); //traer coleccion HTML
    //console.log(link)
    let linksUrl = Array.from(linksHTML); //convertir la colección HTML en un array
    //console.log(links)
    linksUrl.forEach(function(item) { //iterar el array para asignarle evento a cada url
        item.addEventListener("click", function(event) {
            let url = item.getAttribute("linkReference");
            requestModal(event, url);
        })
    });


};

//funcion para hacer la petición de los datos de cada personaje de cada url
const requestModal = (event, url) => {
    //let url = event.target.innerText //guardar el texto de cada url accediendo a su event target para asignarle el modal correspondiente a cada uno
    fetch(url).then(function(response) { //peticion del resultado de la iteracion de url, para acceder a su informacion
            //console.log(response, "personaje")
            return response.json();
        })
        .then(function(data) {
            //console.log(data)
            let name = data.name;
            let height = data.height;
            let mass = data.mass;
            let hairColor = data.hair_color;
            let skinColor = data.skin_color;
            paintModal(name, height, mass, hairColor, skinColor);
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
};

//funcion para agregarles valores a los elementos html del modal
const paintModal = async(name, height, mass, hairColor, skinColor) => {
    //console.log(name)
    const modalTemplate =
        `<div class="modal-header">
                            <h5  id="modal-title">${name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
                        </div>
                        <div class="modal-body">
                            <p id="height">Height: ${height}</p>
                            <p id="mass">Mass: ${mass}</p>
                            <p id="hair-color">Hair Color: ${hairColor}</p>
                            <p id="skin-color">Skin Color: ${skinColor}</p>
                        </div>`;

    const modalContainer = document.getElementById('modal-content');
    modalContainer.innerHTML = modalTemplate

};

loadPage();