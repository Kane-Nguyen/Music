const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'NHK_MUSIC'

const _this = this;
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat : false,
  config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Waiting For You",
      singer: "Mono",
      path: "./assets/songs/song1.mp3",
      image: "./assets/img/mono-1-img.png",
    },
    {
      name: "Em Là",
      singer: "Mono",
      path: "./assets/songs/song2.mp3",
      image: "./assets/img/mono-1-img.png",
    },
    {
      name: "Quên Anh Đi",
      singer: "Mono",
      path: "./assets/songs/song3.mp3",
      image: "./assets/img/mono-1-img.png",
    },
    {
      name: "Anh Chưa Thương Em Đến Vậy Đâu",
      singer: "Lady Mây",
      path: "./assets/songs/song4.mp3",
      image: "./assets/img/img2.png",
    },
    {
      name: "Dĩ Vãng Nhạt Nhòa ( Cover )",
      singer: "Thảo Bunny",
      path: "./assets/songs/song5.mp3",
      image: "./assets/img/img3.jpg",
    },
    {
      name: "Hãy Trao Cho Anh",
      singer: "Son Tung MTP",
      path: "./assets/songs/song6.mp3",
      image: "./assets/img/img4.jpg",
    },
   
  ],
  setConfig: function(key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
                <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this 
    const cdWidth = cd.offsetWidth;
    // xữ lý cd quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iteration: Infinity
    })
    cdThumbAnimate.pause();

    // xữ lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    },
    // xữ lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // xữ lý phát lại 1 bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat',_this.isRepeat)
      repeatBtn.classList.toggle('active', _this.isRepeat);

    };
    // khi song đươc pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // khi tiến độ bài hát thay đỗi vào
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // xữ lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    // khi next song
    nextBtn.onclick = function (){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.nextSong()
      }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
    };
    // khi pre song
    prevBtn.onclick = function (){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.preSong()
      }
      audio.play();
      _this.render();
  };
  // khi xữ lý random bật tắt random song b
  randomBtn.onclick = function (e){
   _this.isRandom = !_this.isRandom;
   _this.setConfig('isRamdom',_this.isRandom)
   randomBtn.classList.toggle('active', _this.isRandom);
};

// xử lý khi next khi audio ended
audio.onended = function () {
  if ( _this.isRepeat){
    audio.play();

  }else {
    nextBtn.click();
  }
};
// lắng nghe hành vi click 
playlist.onclick = function (e) {
  const songNode = e.target.closest('.song:not(.active)')
  if ( songNode ||  e.target.closest(".option") ){
    // xữ lý click vào song 
    if (songNode){
      _this.currentIndex =Number(songNode.dataset.index )
      _this.loadCurrentSong()
      audio.play()
      _this.render()
    }
  }
  
};
},
  scrollToActiveSong : function () {
    setTimeout(() =>{
      $('.song.active').scrollIntoView(
        {
        behavior: 'smooth',
        block: 'center'
      })
    },300)
  },
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  nextSong: function(){
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong();
  },
  preSong: function(){
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1 
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
   let newIndex 
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex ;
    this.loadCurrentSong();

  },

  start: function() {
    //gáng cấu hình từ config vào ứng dug
    this.loadConfig()
    // định nghĩa các thuộc tính cho object
    this.defineProperties()
    // lắng nghe và sữ lí các sự kiện
    this.handleEvents()
    //tải thông tin bài hát đầu tiên vào UI Khi chạy ứng dụng
    this.loadCurrentSong()
    // render playlist
    this.render()
  },
};

app.start();
