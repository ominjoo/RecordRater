var typed = new Typed(".auto-typed", {
    strings : ["rock", "rap", "pop", "rnb", "alternative", "all music!"],
    typeSpeed : 100,
    backSpeed : 70,
    loop : true,
});




const getAlbum = async(artist, album) => {
    try {
        const albumGeneralResponse = await fetch(`https://musicbrainz.org/ws/2/release/?fmt=json&query=release:${encodeURIComponent(album)}%20AND%20artist:${encodeURIComponent(artist)}&status:official&limit=20`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await albumGeneralResponse.json();
        console.log(data.releases.length);
        
        const min = 0;
        const max = data.releases.length - 1;
        const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(randomInt);
        const albumRelease = data.releases[randomInt];


        const albumID = albumRelease.id;
        console.log(albumRelease);

        const coverURL = `https://coverartarchive.org/release/${albumID}/front`;
        const albumName = albumRelease.title;
        const artistName = albumRelease['artist-credit'][0].name;
        const tracks = albumRelease.media[0]['track-count'];
        const date = albumRelease.date;
        
        displayAlbumInfo(coverURL, albumName, artistName, tracks, date);
        
        
    } catch (error) {
        console.error('Error fetching album:', error);
    }
};

const displayAlbumInfo = (coverURL, albumName, artistName, tracks, date) => {
    $('#albumCover').html(`
        <img src="${coverURL}" alt="" style="max-width: 300px;">
    `);

    $('#albumName').html(`
        <p>${artistName} - ${albumName} (${date})</p>
    `);
    

    $('#tracks').html(`
        <p>Tracks: ${tracks}</p>
    `);

};



$(document).ready(() => {
    $("#search").click(async () => {
        event.preventDefault();
        
        let artist = $('#artistInput').val().trim();
        let album = $('#albumInput').val().trim();

        try {
            //$("#confirm").hide();
            $("#search").text("Searching...");
            console.log(artist +" "+ album);
            await getAlbum(artist, album);
            $("#search").text("Find other release");
            $("#confirm").show();

        } catch (error) {
            console.error('Error:', error);
        }

    });
});





