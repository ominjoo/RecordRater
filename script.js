var typed = new Typed(".auto-typed", {
    strings : ["rock", "rap", "pop", "rnb", "alternative", "all music!"],
    typeSpeed : 100,
    backSpeed : 70,
    loop : true,
});

$("#confirm").hide();



const getAlbum = async(artist, album) => {
    try {
        const albumGeneralResponse = await fetch(`https://musicbrainz.org/ws/2/release/?fmt=json&query=release:${encodeURIComponent(album)}%20AND%20artist:${encodeURIComponent(artist)}`, {
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
        const tracksNum = albumRelease.media[0]['track-count'];
        const date = albumRelease.date;
        const statusType = albumRelease.status;
        
        displayAlbumInfo(coverURL, albumName, artistName, tracksNum, date, statusType);


        const releaseResponse = await fetch(`https://musicbrainz.org/ws/2/release/${albumID}?inc=recordings&fmt=json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const releaseData = await releaseResponse.json();

        const tracks = releaseData.media[0]?.tracks

        console.log('Tracks:', tracks);

    } catch (error) {
        console.error('Error fetching album:', error);
    }
};

const displayAlbumInfo = (coverURL, albumName, artistName, tracksNum, date, statusType) => {
    $('#albumCover').html(`
        <img src="${coverURL}" alt="" style="max-width: 300px;">
    `);

    if(date != "" && date != null){
    $('#albumName').html(`
        <p>${artistName} - ${albumName} (${date})</p>
    `);
    } else {
        $('#albumName').html(`
        <p>${artistName} - ${albumName}</p>
    `);
    }

    $('#status').html(`
        <p>[${statusType} Release]</p>
    `);

    $('#tracks').html(`
        <p>Tracks: ${tracksNum}</p>
    `);

};



$(document).ready(() => {
    $("#search").click(async () => {
        event.preventDefault();
        $("#confirm").hide();
        let artist = $('#artistInput').val().trim();
        let album = $('#albumInput').val().trim();

        if(!artist || !album) {
            alert('Please enter artist and album name.');
            return;
        }

        try {
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

$(document).ready(() => {
    $("#confirm").click(async () => {
        window.location.href = 'page2.html';
    });
});



