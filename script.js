class RadioPlayer {
    constructor() {
        this.audio = new Audio();
        this.audio.preload = 'none';
        this.currentStation = null;
        this.isPlaying = false;

        // DOM Elements
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.stationsList = document.getElementById('stationsList');
        this.stationName = document.getElementById('station-name');
        this.status = document.getElementById('status');

        // Event Listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.audio.addEventListener('playing', () => this.updateStatus('Tocando'));
        this.audio.addEventListener('pause', () => this.updateStatus('Pausado'));
        this.audio.addEventListener('error', () => this.handleError());

        // Initialize
        this.initializeStations();
        this.setVolume(this.volumeSlider.value);
    }

    initializeStations() {
        radioStations.forEach(station => {
            const stationElement = document.createElement('div');
            stationElement.className = 'station-item';
            stationElement.textContent = station.name;
            stationElement.addEventListener('click', () => this.selectStation(station));
            this.stationsList.appendChild(stationElement);
        });
    }

    selectStation(station) {
        // Remove active class from all stations
        document.querySelectorAll('.station-item').forEach(el => 
            el.classList.remove('active')
        );

        // Add active class to selected station
        const stationElement = Array.from(this.stationsList.children)
            .find(el => el.textContent === station.name);
        if (stationElement) {
            stationElement.classList.add('active');
        }

        if (this.currentStation?.id !== station.id) {
            this.currentStation = station;
            this.audio.src = station.url;
            this.stationName.textContent = station.name;
            this.play();
        } else {
            this.togglePlay();
        }
    }

    togglePlay() {
        if (!this.currentStation) {
            alert('Por favor, selecione uma estação primeiro.');
            return;
        }

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton();
                })
                .catch(error => {
                    console.error('Erro ao reproduzir:', error);
                    this.handleError();
                });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    setVolume(value) {
        const volume = value / 100;
        this.audio.volume = volume;
    }

    updatePlayButton() {
        this.playPauseBtn.innerHTML = this.isPlaying ? '<span>⏸</span>' : '<span>▶</span>';
    }

    updateStatus(message) {
        this.status.textContent = message;
    }

    handleError() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.updateStatus('Erro ao carregar a rádio');
        console.error('Erro ao carregar ou reproduzir a rádio');
    }
}

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RadioPlayer();
});
