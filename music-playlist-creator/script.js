/*
LEAVING THIS COMMENT HERE FROM MY ORIGINAL PLANNING OF THIS PROJECT - this was my original plan to implement - show my thinking
load page fetches json and puts into array
renderCards populates array onto site
each card has a like an edit - calls editplaylistprompt delete - calls deleteplaylist any other click opens modal

add playlist button
three prompts for name author art
promp for song in delimited fashion
put that into array of objects 
push new object into playlists w 0 likes
rendercards

edit button
same prompts but pre filled
one prefilled w delimited
parse and write to array and rendercards

delete splices array
*/

//Playlists array to store json data
let playlists = [];
//Store original to repopulate playlists from beginning state on reset
let playlistsOriginal = [];

//Elements that will be used later on
const cardContainer = document.getElementById("playlist-cards");
const detailModal = document.getElementById("playlistModal");
const detailCloseBtn = document.getElementsByClassName("close")[0];
const addPlaylistBtn = document.getElementById("add-playlist-btn");

//Get json to array and render the playlists
fetch("data/data.json")
  .then((res) => res.json())
  .then((data) => {
    if (!data.playlists) {
      cardContainer.innerHTML = "<p>No Playlists Added</p>";
      return;
    }
    //Populate playlists array with data from json objects for each playlist
    playlists = data.playlists.map((p) => ({
      playlistId: p.playlistID,
      playlist_name: p.playlist_name,
      playlist_author: p.playlist_author,
      playlist_art: p.playlist_art,
      like_count: p.like_count,
      songs: p.songs.slice(),
    }));
    playlistsOriginal = playlists;
    renderCards();
  })
  .catch((err) => {
    console.error("Fetch Error:", err);
  });

//render playlists to html - this will be used often
//Define the framework and data of a playlist card
function renderCards() {
  cardContainer.innerHTML = "";

  if (playlists.length === 0) {
    cardContainer.innerHTML = "<p>NO PLAYLISTS</p>";
    return;
  }

  playlists.forEach((playlist, index) => {
    const card = document.createElement("article");
    card.className = "playlist";
    //Meat of playlist card - populate with data from array and add to html
    //innerHTML not safe but acceptable when reading from trusted data source?
    card.innerHTML = `
        <img src="${playlist.playlist_art}" id="image-card" alt="Playlist Art">
        <h3>${playlist.playlist_name}</h3>
        <p>${playlist.playlist_author}</p>
        <div class="like-container">
        <button class ="like-btn">
        <i class="fa-regular fa-heart"></i>
        </button>
        <span class="like-count">${playlist.like_count}</span>
        </div>
        `;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "card-actions";

    //Playlist edit button framework - styling and event listener
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.title = "Edit Playlist";
    editBtn.innerHTML = `<i class = "fa-solid fa-pen"></i>`;
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editPlaylistPrompt(index);
    });

    //Playlist delete button framework - styling and event listener
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Delete Playlist";
    deleteBtn.innerHTML = `<i class = "fa-solid fa-trash"></i>`;
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deletePlaylist(index);
    });

    //Add buttons to card through actionsDiv
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);

    //State variables for like counter
    let liked = false;
    let likeCount = playlist.like_count;

    //Like button elements
    const likeBtnIcon = card.querySelector(".like-btn i");
    const likeCountSpan = card.querySelector(".like-count");

    //Logic to determine response to a like or unlike of playlist
    //Solid Font awesome heart represents a liked and regular represents a lack of like
    likeBtnIcon.addEventListener("click", (e) => {
      //Stop propogation of opening modal when like button clicked
      e.stopPropagation();
      //Logic if not liked already
      if (!liked) {
        liked = true;
        likeCount++;
        likeBtnIcon.classList.remove("fa-regular");
        likeBtnIcon.classList.add("fa-solid");
      }
      //Logic if already liked
      else {
        liked = false;
        likeCount--;
        likeBtnIcon.classList.remove("fa-solid");
        likeBtnIcon.classList.add("fa-regular");
      }
      playlist.like_count = likeCount;
      likeCountSpan.textContent = likeCount;
    });

    //Open the card modal on a click to the card that is not a definedbutton
    card.addEventListener("click", () => openDetailModal(playlist));
    cardContainer.appendChild(card);
  });
}

//Delete a playlist
function deletePlaylist(index) {
  playlists.splice(index, 1);
  renderCards();
}

//Modal logic section

//Stop displaying the modal when it is closed - either on x button or elsewhere on screen
detailCloseBtn.onclick = () => {
  detailModal.style.display = "none";
};
window.addEventListener("click", (e) => {
  if (e.target === detailModal) detailModal.style.display = "none";
});

//Shuffle function to be used when array is shuffled
//Fisher-Yates shuffle algorithm - O(n) efficiency and O(1) space
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

//Function to open a modal upon a card being clicked
function openDetailModal(playlist) {
  document.getElementById("modalTitle").innerText = playlist.playlist_name;
  document.getElementById(
    "modalCreator"
  ).innerText = `By ${playlist.playlist_author}`;
  document.getElementById(
    "modalImage"
  ).innerHTML = `<img src="${playlist.playlist_art}" alt="Playlist Art">`;

  //Ternary operator to check if songs exist and then populate a shallow copy if not
  //Useful to shuffle songs in place and then keep original ordering
  //If playlist.songs is an array then it will slice it and assign to currentSongs - if not then empty array to current
  let currentSongs = Array.isArray(playlist.songs)
    ? playlist.songs.slice()
    : [];

  const songsContainer = document.getElementById("modalSongs");
  songsContainer.innerHTML = "";

  //Logic to shuffle songs
  if (currentSongs.length > 0) {
    const shuffleBtn = document.createElement("button");
    shuffleBtn.id = "shuffle-btn";
    shuffleBtn.innerHTML = `<i class="fa-solid fa-shuffle"></i> Shuffle`;

    //Unordered list to hold the songs
    const ul = document.createElement("ul");
    ul.style.listStyleType = "disc";
    ul.style.paddingLeft = "1.2rem";

    //Function to render the songs - renders the currentSongs copy of original ordering
    function renderSongList() {
      ul.innerHTML = "";
      currentSongs.forEach((songObj) => {
        const li = document.createElement("li");
        li.innerText = `${songObj.title} - ${songObj.artist} (${songObj.duration})`;
        ul.appendChild(li);
      });
    }
    renderSongList();
    //Logic for shuffle button
    shuffleBtn.addEventListener("click", () => {
      shuffleArray(currentSongs);
      renderSongList();
    });

    //Add shuffle button and songs to the songsContainer
    songsContainer.appendChild(shuffleBtn);
    songsContainer.appendChild(ul);
  } else {
    songsContainer.innerText = "No songs found";
  }
  detailModal.style.display = "block";
}

//Add playlist handler
addPlaylistBtn.addEventListener("click", addPlaylistPrompt);

//Prompt user for playlist information
function addPlaylistPrompt() {
  const name = prompt("Enter playlist name:");
  const author = prompt("Enter author name:");
  const art = prompt("Enter artwork URL - (assets/img/playlist.png):");

  const songsRaw = prompt(
    'Enter songs (comma-separated). Format "Title|Author|1:00, Title2|Author2|2:00"'
  );

  //Logic to parse the songs input from user - janky but hits rubric
  //Essentially asking for song objects whose parts are delimited by pipes and objects are csv
  const songsArray = songsRaw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((entry) => {
      const parts = entry.split("|").map((p) => p.trim());
      return {
        title: parts[0] || "",
        artist: parts[1] || "",
        duration: parts[2] || "",
      };
    })
    .filter((s) => s.title && s.artist && s.duration);

  //Create new playlist and add to playlists array and sanitize input
  const newId = 1;
  playlists.push({
    playlistId: newId,
    playlist_name: name.trim(),
    playlist_author: author.trim(),
    playlist_art: art.trim(),
    like_count: 0,
    songs: songsArray,
  });

  renderCards();
}

//Same logic as adding a playlist but we are editing one that already exits
//Takes the index of that playlist as input
//Possible fix would be combining these two functions? Maybe have a boolean input to check
// if we want an add or an edit and go from there?
function editPlaylistPrompt(index) {
  //Grab playlist object and fill prompts with its current data
  const pl = playlists[index];

  const newName = prompt("Enter playlist name:", pl.playlist_name);
  const newAuthor = prompt("Enter author name:", pl.playlist_author);
  const newArt = prompt(
    "Enter artwork URL - (assets/img/playlist.png):",
    pl.playlist_art
  );

  const existingSongs = pl.songs
    .map((s) => `${s.title}|${s.artist}|${s.duration}`)
    .join(", ");

  const songsRaw = prompt(
    'Enter songs (comma-separated). Format "Title|Author|1:00, Title2|Author2|2:00"',
    existingSongs
  );
  //Same logic as add
  const songsArray = songsRaw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((entry) => {
      const parts = entry.split("|").map((p) => p.trim());
      return {
        title: parts[0] || "",
        artist: parts[1] || "",
        duration: parts[2] || "",
      };
    })
    .filter((s) => s.title && s.artist && s.duration);
  //Sanitize input slightly
  pl.playlist_name = newName.trim();
  pl.playlist_author = newAuthor.trim();
  pl.playlist_art = newArt.trim();
  pl.songs = songsArray;
  renderCards();
}

document.getElementById("search-form").addEventListener("submit", handleSearch);

//Search function based on user input to form
function handleSearch(event) {
  //Stop html from freaking out with preventDefault
  event.preventDefault();
  //Handle upper or lowercase searches
  let searchValue = document.getElementById("search-title").value.toLowerCase();
  //Use both search for artist of playlist or title of playlist as required by project guidelines
  let playlistsNames = playlists.filter((item) =>
    item.playlist_name.toLowerCase().includes(searchValue)
  );
  playlists = playlists.filter((item) =>
    item.playlist_author.toLowerCase().includes(searchValue)
  );
  //Put artist results and title results on display
  playlists = playlists.concat(playlistsNames);
  renderCards();
}

document.getElementById("clear-search").addEventListener("click", resetCards);

//function to reset playlists to the defualt json playlists
function resetCards() {
  document.getElementById("search-form").reset();
  event.preventDefault();
  playlists = playlistsOriginal;
  renderCards();
}

//Buttons that sort the array using different criteria (sort-options)
document
  .getElementById("sort-options")
  .addEventListener("submit", sortPlaylists);

//Function to sort - we will reorder playlists array based on user choice
function sortPlaylists(event) {
  event.preventDefault();
  const sortValue = document.getElementById("sort-value").value;
  //Sort by title alphabetically
  if (sortValue == "nameAlphabetically") {
    playlists.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
    //Sort by number of likes - non-increasing order
  } else if (sortValue == "numberOfLikes") {
    playlists.sort(
      (a, b) => parseInt(b.like_count, 10) - parseInt(a.like_count, 10)
    );
  } else {
    //sort by ID (Date stand in)
    console.log("idSort");
    playlists.sort(
      (a, b) => parseInt(a.playlistId, 10) - parseInt(b.playlistId),
      10
    );
  }
  renderCards();
}
