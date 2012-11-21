function bsdapp() {

    var player, favindex;
    var currentIndex = -1;
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
  self.currenttime = ko.observable("00:00");
  self.totaltime = ko.observable("00:00");
  self.sliderposition = ko.observable();
  self.totalloaded = ko.observable();
  self.currentvolume = ko.observable(50);
  self.paused = ko.observable(true);
  self.currentArtist = ko.observable("");
  self.currentTitle = ko.observable("");
  self.currentCover = ko.observable("");
  self.currentId = ko.observable();
  self.currentPlaylistName = ko.observable("");
  self.currentPlaylistId = ko.observable(0);
  self.shuffle = ko.observable(false);
  self.tempvol = ko.observable(0);
  self.playlists = ko.observableArray([]);  
  self.tracks = ko.observableArray([]);
  self.wrapperstate = ko.observable(false);
  self.isLoading = ko.observable(false);
  self.tracksonpage = ko.observableArray([]);

  //user observables
  self.userid = ko.observable(0);
  self.current_user = ko.observable("");
  self.isLoggedIn = ko.observable(-1);
  self.firstName = ko.observable("");
  self.pic = ko.observable("http://i.imgur.com/A82Lm.jpg");
  self.path = ko.observable("");

  //ui observables
  self.modaltitle= ko.observable("");
  self.usermethod=ko.observable(true);
  self.errormsg = ko.observable("");
  var favs = [];
  self.isSaved = ko.observable(0);

  self.currentView = ko.observable("");
  self.currindex = ko.observable(0);

  //comments
  self.current_comments=ko.observableArray([]);

    //Debugging
    self.status = ko.observable('Music player object created');

    self.changepage = function(page){
        self.currentView(page.currentId.replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();}));
        self.status('Switched view to: '+page.currentId);
    }

    self.gettracks = function(){
        self.status('Fetching data from server...');
        $.ajax({
            url: "http://brainshutdown.com/api/tracks&20/"+self.tracksonpage().length,
            type: "GET",
            dataType: "json",
            success: function(allData) {
                var mappedTasks = $.map(allData, function(item) { return new trackItem(item) });
                ko.utils.arrayPushAll(self.tracksonpage, mappedTasks);
                self.status('20 tracks pushed to Main Array');
            }
          });
    }

    self.popqueue = function(){
        self.tracks.pop();
    }

    self.dequeue = function(){
        self.tracks.shift();
    }

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

    self.addtrack = function (playIt,last,track) {

        if(playIt){
          if(player){player.destruct();}
          self.currenttime("00:00");
          self.totaltime("00:00");
          self.totalloaded(0);
          self.sliderposition(0);
          self.isLoading(true);
        }

        for(var i= 0; i < self.tracks().length; ++i) {
            if(track.id == self.tracks()[i].id) {
              if(playIt)
              self.playtrack(self.tracks()[i]);
              return false;
            }
          }

        last ? self.tracks.push(track) : self.tracks.splice(self.currindex()+1,0,track);
        self.status('track id: '+track.id+' pushed to Queue Array. Autoplay: '+playIt);
        if(playIt) self.playtrack(track);

    }

    self.playtrack = function (track) {
    self.isLoading(true);
    if(currentIndex==self.tracks.indexOf(track))return false;
    currentIndex = self.tracks.indexOf(track);

    self.currindex(currentIndex);

    self.currentArtist(track.artist);
    self.currentTitle(track.title);
    self.currentId(track.id);
    self.currentCover(track.cover);
    self.currenttime("00:00");
    self.totaltime("00:00");

    self.totalloaded(0);
    self.sliderposition(0);
    self.paused(false);

    if(player) {
        player.destruct();
      }

    //$.getJSON("/api/play/"+track.id,function(data) {});

    player = soundManager.createSound({
          id: 'bsd_track',
          url: track.trackurl.match(/soundcloud/) ? track.trackurl+'?consumer_key=81fe486a59f325677ff66f1bc8476cbd' : track.trackurl,
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
    self.next();
    };

  function _onLoading() {
    self.totalloaded((this.bytesLoaded/this.bytesTotal)*timeBarWidth);
    };

  function _onPlaying() {
      self.currenttime(_convertTime(this.position/1000));
      self.totaltime(_convertTime(this.durationEstimate/1000));
      self.sliderposition((this.position/this.durationEstimate)*timeBarWidth);
    };

  function _convertTime(second) {
      second = Math.abs(second);
      var val = new Array();
      val[0] = Math.floor(second/3600%24);
      val[1] = Math.floor(second/60%60);
      val[2] = Math.floor(second%60);
      var stopage = true;
      var cutIndex  = -1;
      for(var i = 0; i < val.length; i++) {
        if(val[i] < 10) val[i] = "0" + val[i];    
        if( val[i] == "00" && i < (val.length - 2) && !stopage) cutIndex = i;
        else stopage = true;
      }
      val.splice(0, cutIndex + 1);
      if(val[0]="00")val.splice(0,1);
      return val.join(':');
  };

    function _onLoad(state) {

    };



}