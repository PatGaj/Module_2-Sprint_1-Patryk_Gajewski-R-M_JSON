// variables section
let page = 1;
let maxPage;
const [main] = document.getElementsByTagName("main");
const radio = document.getElementsByClassName("liveType");
const nextPage = document.getElementById("nextPage");
const previousPage = document.getElementById("previousPage");
const search = document.getElementById("filter");
const addCharacter = document.getElementById("createNewCharater");

// code section
addCharacter.addEventListener("click", () => {
  addCharacterToJson(
    document.getElementById("newCharacterName").value,
    document.getElementById("newCharacterStatus").value,
    document.getElementById("newCharacterSpecies").value
  );
});

nextPage.addEventListener("click", () => {
  page += 1;
  if (page > maxPage) {
    page = maxPage;
    return;
  }
  getCharactersFromJson(checked(), page, search.value);
});

previousPage.addEventListener("click", () => {
  page -= 1;
  if (page < 1) {
    page = 1;
    return;
  }
  getCharactersFromJson(checked(), page, search.value);
});

search.addEventListener("input", () => {
  page = 1;
  getCharactersFromJson(checked(), page, search.value);
});

for (let element of radio) {
  element.addEventListener("click", () => {
    page = 1;
    getCharactersFromJson(checked(), page, search.value);
  });
}

getCharactersFromJson(checked(), page, search.value);

// function section
function buildElement(typeElement, idElement, classElement, textElement, srcElement) {
  const element = document.createElement(typeElement);
  if (idElement) {
    element.id = idElement;
  }
  if (classElement) {
    element.className = classElement;
  }
  if (textElement) {
    element.textContent = textElement;
  }
  if (srcElement) {
    element.src = srcElement;
  }
  return element;
}

function createBlockForCharacter(name, status, species, image, id) {
  const characterBlock = buildElement("div", undefined, "character");
  const characterImage = buildElement("img", undefined, undefined, undefined, image);
  const characterName = buildElement("span", undefined, "name", name);
  const characterStats = buildElement("div", undefined, "stats");
  const characterId = id;
  function makeStat(statName, statValue) {
    const stat = buildElement("div", undefined, "stat");
    const spanName = buildElement("span", undefined, undefined, statName);
    const spanValue = buildElement("span", undefined, undefined, statValue);
    stat.append(spanName, spanValue);
    return stat;
  }
  const characterStatus = makeStat("Status: ", status);
  const characterSpecies = makeStat("Gatunek: ", species);
  characterStats.append(characterStatus, characterSpecies);
  const deleteButton = buildElement("button", undefined, "deleteButton", "Delete Character");
  deleteButton.addEventListener("click", () => deleteCharacterFromJson(characterId));
  characterBlock.append(characterImage, characterName, characterStats, deleteButton);
  return characterBlock;
}

function checked() {
  const selectedOption = document.querySelector('input[name="liveType"]:checked').value;
  return selectedOption;
}

async function getCharactersFromJson(status, page, filter) {
  const limit = 5;
  main.textContent = "";
  let URL = `http://localhost:3000/results?_page=${page}&_limit=${limit}&status=${status}`;
  if (filter) {
    URL = `${URL}&name_like=${filter}`;
  }
  try {
    const respons = await fetch(URL);
    const data = await respons.json();
    const elements = respons.headers.get("X-Total-Count");
    maxPage = Math.ceil(elements / limit);
    for (let character of data) {
      main.append(
        createBlockForCharacter(character.name, character.status, character.species, character.image, character.id)
      );
    }
    if (main.children.length === 0) {
      main.innerHTML = "Nie znaleziono postaci spełniających kryteria wyszukiwania.";
    }
  } catch (error) {}
}

async function addCharacterToJson(characterName, characterStatus, characterSpecies) {
  const characterImage = "https://rickandmortyapi.com/api/character/avatar/3.jpeg";
  const URL = "http://localhost:3000/results";
  try {
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: characterName,
        status: characterStatus,
        species: characterSpecies,
        image: characterImage,
      }),
    });
  } catch (error) {}
}

async function deleteCharacterFromJson(id) {
  const URL = `http://localhost:3000/results/${id}`;
  try {
    await fetch(URL, {
      method: "DELETE",
    });
  } catch (error) {}
}
