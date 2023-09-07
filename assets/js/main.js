const pokmonList = document.getElementById("pokemonLIst");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function formaterNumber(number) {
  if (number < 10) {
    return "000" + number;
  } else if (number < 100 && number > 9) {
    return "00" + number;
  } else {
    return "0" + number;
  }
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons
      .map(
        (pokemon) => `       
        <li id="btnModalPoke" class="btnModalPoke ${pokemon.number} pokemon ${pokemon.type}">
        <span class="number"><strong>#${formaterNumber(
          pokemon.number
        )}</strong></span>
        <span class="name">${pokemon.name}</span>   
        <div class="detail">
        <ol class="types">
        ${pokemon.types
          .map((type) => `<li class="type ${type}">${type}</li>`)
          .join("")}
        </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div> 
        </li>         
        `
      )
      .join(" ");
    pokmonList.innerHTML += newHtml;

    // ------------------------ Modal do Pokemon ----------------------//
    function loadModalPokemon(number) {
      pokeApiModal.getModalPokemon(number).then((pokemonsModal = []) => {
        const modalHTML = document.createElement("div");
        modalHTML.innerHTML += ` 
      <div class="modalPoke ${pokemonsModal.type}">
      <div class="modal-content ${pokemonsModal.type}">
      <div class="header-modal ${pokemonsModal.type}">
        <span class="closetPoke">×</span>
        <span class="${pokemonsModal.number}">
            <strong>#${formaterNumber(
              pokemonsModal.number
            )}</strong>
        </span>
      </div>
      <div class="content-modal">
        <div class="content-head-modal">
            <strong class="name">${pokemonsModal.name}</strong>
        </div>
        <div class="infos">
        <img src="${pokemonsModal.photo}" alt="${pokemonsModal.name}">
         <div class="type">
              <h1>Types</h1>
              <ol class="types-content">
              ${pokemonsModal.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
              </ol>
            </div>
            <div>
              <h1>Stats</h1>
             <div class="stats">
             <ol class="stats-content">
             ${pokemonsModal.stats
               .map((stats) => `<li class="type ${stats}">${stats}</li>`)
               .join("")}
                 </ol> 
                  <ol class="stat-content">
                  ${pokemonsModal.stat
                    .map((stat) => `<li class="type ${stat}">${stat}</li>`)
                    .join("")}
                      </ol>  
                      </div>                 
             </div>
             <div class="caracter">
              <div class="height">
                <h1>Height</h1>
                <strong>${pokemonsModal.height}</strong>
            </div>
            <div class="weight">
                <h1>Weight</h1>
                <strong>${pokemonsModal.weight}</strong>
            </div>
            <div class="abilities">
                <h1>Abilities</h1>
                <strong>${pokemonsModal.abilities}</strong>
            </div>
             </div>
            </div>
        </div>
      </div>
    </div>
     </div>`;
        document.body.appendChild(modalHTML);

        //------ Closet modal -----//
        const closetPoke = document.querySelectorAll(".closetPoke");
        const modalContentPoke = document.querySelectorAll(".modalPoke");
        for (let i = 0; i < closetPoke.length; i++) {
          closetPoke[i].onclick = function () {
            modalContentPoke[i].style.display = "none";
          };
        }
      });
    }

    const btnModalPoke = document.querySelectorAll(".btnModalPoke");
    for (let i = 0; i < btnModalPoke.length; i++) {
      btnModalPoke[i].addEventListener("click", () => {
        const number = parseInt(
          btnModalPoke[i].attributes[1].textContent.split(" ")[1]
        );
        loadModalPokemon(number);
      });
    }
  });
}

loadPokemonItens(offset, limit);
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordNexPage = offset + limit;
  if (qtdRecordNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
