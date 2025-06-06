//Populate the HTML on load - will grab a random playlist and display it 

document.addEventListener("DOMContentLoaded", () => {
    //Container to display playlist
    const featuredContainer = document.getElementById("featured-playlist");

    //Code to grab the playlist json data and populate playlists array with it
    fetch("data/data.json")
    .then((res) => res.json())
    .then((data) => {
        //Faulty data check
        if (!data.playlists) {
        cardContainer.innerHTML = "<p>No Playlists Added</p>";
        return;
    }

    //Index into playlists at random
    const randomIndex = Math.floor(Math.random() * data.playlists.length);
    const playlist = data.playlists[randomIndex];

    //Elements to display the playlist data
    const wrapper = document.createElement("article");
    wrapper.className = "featured-playlist-card";
    
    //Playlist art 
    const img = document.createElement("img");
    img.src = playlist.playlist_art;
    img.alt = `${playlist.playlist_name} Artwork`;
    img.className = "featured-art";

    //Playlist title 
    const title = document.createElement("h2");
    title.innerText = playlist.playlist_name;

    //Playlist author
    const author = document.createElement("h2");
    author.innerText = `By: ${playlist.playlist_author}`;

    //Playlist songs div
    const songsDiv = document.createElement("div");
    songsDiv.className = "featured-songs";

    //Populate all songs in playlist and add styling
    if (playlist.songs.length > 0) {
    const ul = document.createElement("ul");
    ul.style.listStyleType = "disc";
    ul.style.paddingLeft = "1.2rem";

    playlist.songs.forEach((songObj) => {
    const li = document.createElement("li");
    li.innerText = `${songObj.title} - ${songObj.artist} (${songObj.duration})`;
    ul.appendChild(li);
    });
    songsDiv.appendChild(ul);
    }
    else{
        songsDiv.innerText = "No songs found";
    }
    //Add all elements
    wrapper.appendChild(img);
    wrapper.appendChild(title);
    wrapper.appendChild(author);
    wrapper.appendChild(songsDiv);

    featuredContainer.appendChild(wrapper);

    

    })
    .catch((err) => {
    console.error("Fetch Error:", err);
    });
});
