$(document).ready(() => {
    var typed = new Typed(".auto-typed", {
        strings: ["rock", "rap", "pop", "rnb", "alternative", "all music!"],
        typeSpeed: 100,
        backSpeed: 70,
        loop: true,
    });

    $("#confirm").hide();

    const getAlbum = async (artist, album) => {
        try {
            const albumGeneralResponse = await fetch(`https://musicbrainz.org/ws/2/release/?fmt=json&query=release:${encodeURIComponent(album)}%20AND%20artist:${encodeURIComponent(artist)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await albumGeneralResponse.json();
            if (!data.releases || data.releases.length === 0) {
                console.error('No releases found');
                return;
            }
            const randomInt = Math.floor(Math.random() * data.releases.length);
            const albumRelease = data.releases[randomInt];
            //console.log(albumRelease);
            const albumID = albumRelease.id;

            const coverURL = `https://coverartarchive.org/release/${albumID}/front`;
            console.log(coverURL);
            const albumName = albumRelease.title;
            const artistName = albumRelease['artist-credit'][0].name;
            const tracksNum = albumRelease.media[0]['track-count'];
            const date = albumRelease.date;
            const statusType = albumRelease.status;

            displayAlbumInfo(coverURL, albumName, artistName, tracksNum, date, statusType);

            $("#confirm").click((event) => {
                event.preventDefault();
                window.location.href = 'page2.html?id=' + albumID;
            });

        } catch (error) {
            console.error('Error fetching album:', error);
        }
    };

    const displayAlbumInfo = (coverURL, albumName, artistName, tracksNum, date, statusType) => {
        $('#albumCover').html(`
            <img src="${coverURL}" alt="" style="max-width: 300px;">
        `);

        if (date) {
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

    $("#search").click(async (event) => {
        event.preventDefault();
        $("#confirm").hide();
        let artist = $('#artistInput').val().trim();
        let album = $('#albumInput').val().trim();

        if (!artist || !album) {
            alert('Please enter artist and album name.');
            return;
        }

        try {
            $("#search").text("Searching...");
            console.log(artist + " " + album);
            await getAlbum(artist, album);
            $("#search").text("Find other release");
            $("#confirm").show();
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
