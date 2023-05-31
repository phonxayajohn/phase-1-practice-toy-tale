const toyAPI = `http://localhost:3000/toys`;
const toyCollectionElement = document.getElementById("toy-collection") //constant variable created for renderToy function
const addToyForm = document.getElementById("add-toy-form") //added "add-toy-form" id to line 17 of index.html
// headers object for easy transfer to fetch command - since we will be using the same headers
const headers = {
  Accept: 'application/json',
  'Content-type': 'application/json',
}

let toyList = [] //create empty array to separate data from display

// makes form show and hide
let showAddToyForm = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
addBtn.addEventListener("click", () => { //when #new-toy-btn is clicked, will set showAddToyForm to true or false
  showAddToyForm = !showAddToyForm;     // if showAddToyForm is 'true' it will use style.display = block, if false, it will show non
  toyFormContainer.style.display = showAddToyForm ? 'block' : 'none';
});

addToyForm.addEventListener('submit', addNewToy) // adds event listener to the "add-toy-form" id form itself (not button) and runs addNewToy function

// Fetch Andy's toys
fetch(toyAPI) //GETS toyAPI with fetch command
  .then(res => res.json()) //THEN takes response from toyAPI and converts to .json
  .then(json => {
    toyList = json; //when toyList is returned, make sure it is json
    renderToys(toyList) //runs renderToys function with toyList(arrow with pushed data not direct server database)
  })

function renderToys(toys) { //renders the toy list
  toyCollectionElement.innerHTML = '' //empties list
  toys.forEach(renderToy); //looks at each toy in the array and pulls the data to the page
}

// Creates <div class="card"> card and adds toy info to the card
function renderToy(toy) { //function to add toy to toy list with "card" specifications
  const card = document.createElement('div'); // requirement to create 'div' with class of 'card'
  card.classList.add("card") //adds the "card" class to the div constant 'card'
  const likeButtonId = `like-button-${toy.id}`
  card.innerHTML = `
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  <button class="like-btn" id="${likeButtonId}">Like</button>
  `;
  toyCollectionElement.append(card); // adds the "card" data from above to the toy-collection div
  
  document.getElementById(likeButtonId).addEventListener('click', event => {
    incrementLikes(toy.id) //click event "calls" incrementLikes function with toy.id - more info at 1:02:43 of 052223 JS Toy Tale walkthrough video
  })   
}

function addNewToy(event) { // 'event' due to addNewToy being an event handler (see line 16)
  event.preventDefault(); // calls preventDefault with () to prevent webpage from automatically reloading

  const form = event.target // to get data at the form itself. event.target is the thing that threw the event/listened on. since we have an event listener on addToyForm, the target for the event that is thrown (submit) will be the form
  const newToy = {
    name: form.name.value, //.value because we only want the inputted data not the whole html line
    image: form.image.value,
    likes: 0
  };

  fetch(toyAPI, { //fetch toyAPI to post JSON stringified newToy data
    headers, //uses variable as a shortcut instead of .append
    method: 'POST', //POST sends the newToy data to the server
    body: JSON.stringify(newToy), //always stringify POST body with JSON.stringify(data). Stringifiy will convert data into JSON string
  })
  .then(res => res.json()) //much like GET fetch from line 23, takes the new stringified newToy data
  .then(json => {
    toyList.push(json); //pushes new json response (with updated id) to the toyList array
    renderToys(toyList) //renders new toyList with new toy added
  });
}

function incrementLikes(id) {
  const toy = toyList.find(toy => toy.id === id); // .find used to grab data from our toyList array. finding the first toy id that matches our toyList id

  fetch(`${toyAPI}/${id}`, {  // will be updating/patching a particular toy so wil need to change URL. remember toyAPI is just http://localhost:3000/toys. adding template literal of ${id} adds the id to the end of the URL allowing us to access only that particular id to edit
    headers,
    method: 'PATCH',
    body: JSON.stringify({
      likes: toy.likes + 1, // +1 to toy const's likes
    })
  })
  .then(res => res.json())
  .then(json => {
    toy.likes = json.likes; // matches toy.likes to json.likes
  })
  renderToys(toyList);
}