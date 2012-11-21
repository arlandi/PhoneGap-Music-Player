function bsdapp() {

    var player, favindex;
    var self = this;

    //playlist item class
    function plItem(data) {
        var self = this;
        self.name = ko.observable(data.title);
        self.genre = data.genre;
        self.id = data.id;
        self.userid = data.userid;
        self.tracks = ko.observableArray(data.tracks);
    }

    //track item class
    function trackItem(data) {
        var self = this;
        self.id = data.id;
        self.artist = data.artist;
        self.title = data.title;
        self.fulltitle = data.artist + " - " + data.title;
        self.trackurl = data.trackurl;
        self.cover = data.cover;
        self.numPlays = data.plays;
        self.genre = data.genre;
    }

    //player observables
    //Song time observables
    self.currenttime = ko.observable("00:00");
    self.totaltime = ko.observable("00:00");

    //Slider observables
    self.sliderposition = ko.observable();
    self.totalloaded = ko.observable();

    //Volume observables
    self.currentvolume = ko.observable(50);
    self.tempvol = ko.observable(0);

    //Current song observables
    self.currentArtist = ko.observable("");
    self.currentTitle = ko.observable("");
    self.currentCover = ko.observable("");
    self.currentId = ko.observable();
    self.currentPlaylistName = ko.observable("");
    self.currentPlaylistId = ko.observable(0);

    self.shuffle = ko.observable(false);

    self.playlists = ko.observableArray([]);
    self.tracks = ko.observableArray([]);
    self.wrapperstate = ko.observable(false);
    self.isLoading = ko.observable(false);

    self.paused = ko.observable(true);

    //Debugging
    self.status = ko.observable("");

    self.play = function () {
        if (player.playState) {
            player.resume();
        } else {
            player.play();
        }
        self.paused(false);
    }

    self.pause = function () {
        player.pause();
        self.paused(true);
    }

    self.addtrack = function () {
        var mappedTrack = new trackItem({
            "id": "123",
            "artist": "",
            "title": "",
            "trackurl": "music\/adg3com_cloudlessdays.mp3",
            "buylink": "",
            "cover": "",
            "plays": "",
            "downloads": "",
            "saves": "",
            "date_added": "",
            "genre": "",
            "comments": "",
            "userid": "",
            "username": "",
            "source": ""
        });

        self.playtrack(mappedTrack);
    }

    self.playtrack = function (track) {

        self.isLoading(true);

        self.currentArtist(track.artist);
        self.currentTitle(track.title);
        self.currentId(track.id);
        self.currentCover(track.cover);
        self.currenttime("00:00");
        self.totaltime("00:00");

        self.totalloaded(0);
        self.sliderposition(0);
        self.paused(false);

        if (player) {
            player.destruct();
        }

        player = soundManager.createSound({
            id: 'bsd_track',
            url: track.trackurl,
            autoPlay: true,
            autoLoad: true,
            volume: self.currentvolume(),
            whileloading: _onLoading,
            whileplaying: _onPlaying,
            onfinish: _onFinish,
            onload: _onLoad
        });
    }

    function _onFinish() {

    };

    function _onLoading() {
        self.totalloaded((this.bytesLoaded / this.bytesTotal) * timeBarWidth);
    };

    function _onPlaying() {
        self.currenttime(_convertTime(this.position / 1000));
        self.totaltime(_convertTime(this.durationEstimate / 1000));
    };

    //converts seconds to 00:00:00 format
    function _convertTime(second) {
        second = Math.abs(second);
        var val = new Array();
        val[0] = Math.floor(second / 3600 % 24);
        val[1] = Math.floor(second / 60 % 60);
        val[2] = Math.floor(second % 60);
        var stopage = true;
        var cutIndex = -1;
        for (var i = 0; i < val.length; i++) {
            if (val[i] < 10) val[i] = "0" + val[i];
            if (val[i] == "00" && i < (val.length - 2) && !stopage) cutIndex = i;
            else stopage = true;
        }
        val.splice(0, cutIndex + 1);
        if (val[0] = "00") val.splice(0, 1);
        return val.join(':');
    };

    function _onLoad(state) {

    };



}