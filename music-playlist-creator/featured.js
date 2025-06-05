document.addEventListener("DOMContentLoaded", () => {
    const featuredContainer = document.getElementById("featured-playlist");
    fetch("data/data.json")
    .then((res) => res.json())
    .then((data) => {
        if (!data.playlists) {
        cardContainer.innerHTML = "<p>No Playlists Added</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * data.playlists.length);
    const playlist = data.playlists[randomIndex];

    const wrapper = document.createElement("article");
    wrapper.className = "featured-playlist-card";

    const img = document.createElement("img");
    img.src = playlist.playlist_art;
    img.alt = `${playlist.playlist_name} Artwork`;
    img.className = "featured-art";

    const title = document.createElement("h2");
    title.innerText = playlist.playlist_name;

    const author = document.createElement("h2");
    author.innerText = `By: ${playlist.playlist_author}`;

    const songsDiv = document.createElement("div");
    songsDiv.className = "featured-songs";

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
