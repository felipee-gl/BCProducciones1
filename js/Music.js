// Helper function
function getElementPercentage(click, elm) {
  const rect = elm.getBoundingClientRect();
  return (click.pageX - rect.left) / rect.width * 100;
}

class VolumeControl {
  constructor() {
    this.video = new Audio('https://garethweaver.com/codepen/media/bensound-jazzcomedy.mp3');
    this.video.volume = 0;
    this.video.muted = true;
    this.elm = {
      volumeWrap: document.getElementsByClassName('bsp-volume-wrap')[0],
      volumeSlider: document.getElementsByClassName('bsp-volume-slider')[0],
      volumeProgress: document.getElementsByClassName('bsp-volume-slider-progress')[0],
    };
    this.elm.volumeWrap.addEventListener('mouseenter', this.volumeHoverIn.bind(this));
    this.elm.volumeWrap.addEventListener('mouseleave', this.volumeHoverOut.bind(this));
    this.elm.volumeSlider.addEventListener('click', this.volumeClick.bind(this));
    this.elm.volumeSlider.addEventListener('mousedown', this.volumeDrag.bind(this));
    document.getElementById('bsp-volume').addEventListener('click', this.volumeMute.bind(this));

    // Iniciar la música y activar el sonido al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
      this.video.play();
      this.volumeMute();
    });
  }

  volumeHoverIn(e) {
    clearTimeout(this.volumeHoverTimout);
    if (this.volumeHoverTimout) {
      this.volumeHoverTimout = null;
    }
    this.elm.volumeWrap.classList.add('bsp-volume-show');
  }

  volumeHoverOut(e) {
    this.volumeHoverTimout = setTimeout(() => {
      this.elm.volumeWrap.classList.remove('bsp-volume-show');
    }, 300);
  }

  volumeClick(e) {
    const percent = getElementPercentage(e, this.elm.volumeSlider);
    this.volumeSet(percent);
  }

  volumeSet(percent) {
    this.elm.volumeProgress.style.width = percent + '%';
    this.lastVolume = this.video.volume = percent / 100;
    this.video.play();
  }

  volumeDrag(e) {
    e.preventDefault();
    document.addEventListener('mousemove', this.volumeMoveHandler.bind(this));
    document.addEventListener('mouseup', this.volumeStopHandler.bind(this));
  }

  volumeMoveHandler(e) {
    // Verificar si el botón del mouse está presionado
    if (e.buttons !== 1) {
      return;
    }

    let percent = getElementPercentage(e, this.elm.volumeSlider);
    if (percent < 0) percent = 0;
    else if (percent > 100) percent = 100;
    this.volumeSet(percent);
  }

  volumeStopHandler(e) {
    document.removeEventListener('mousemove', this.volumeMoveHandler.bind(this));
    document.removeEventListener('mouseup', this.volumeStopHandler.bind(this));
  }

  volumeMute() {
    const vol = this.video.volume > 0 ? 0 : (this.lastVolume || 1);
    this.video.volume = vol;
    this.elm.volumeProgress.style.width = vol * 100 + '%';
  }
}

const control = new VolumeControl();
