import React, { Component } from "react";
import albumData from "./../data/albums";
import PlayerBar from "./PlayerBar";

class Album extends Component {
    constructor(props) {
        super(props);

        const album = albumData.find(album => {
            return album.slug === this.props.match.params.slug;
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            currentSongIndex: -1,
            duration: album.songs[0].duration,
            isPlaying: false,
            hover: false,
            currentVolume: 0.8
        };

        this.audioElement = document.createElement("audio");
        this.audioElement.src = album.songs[0].audioSrc;
    }

    play(index) {
        this.audioElement.play();
        this.setState({ isPlaying: true, currentSongIndex: index });
    }

    pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
    }

    componentDidMount() {
        this.eventListeners = {
            timeupdate: e => {
                this.setState({ currentTime: this.audioElement.currentTime });
            },
            durationchange: e => {
                this.setState({ duration: this.audioElement.duration });
            },
            volumechange: e => {
                this.setState({ currentVolume: this.audioElement.volume });
            }
        };
        this.audioElement.addEventListener(
            "timeupdate",
            this.eventListeners.timeupdate
        );
        this.audioElement.addEventListener(
            "durationchange",
            this.eventListeners.durationchange
        );
        this.audioElement.addEventListener(
            "volumechange",
            this.eventListeners.volumechange
        );
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener(
            "timeupdate",
            this.eventListeners.timeupdate
        );
        this.audioElement.removeEventListener(
            "durationchange",
            this.eventListeners.durationchange
        );
    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
    }

    handleSongClick(song, index) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause();
        } else {
            if (!isSameSong) {
                this.setSong(song);
            }
            this.play();
        }
    }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(
            song => this.state.currentSong === song
        );
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleNextClick() {
        const currentIndex = this.state.album.songs.findIndex(
            song => this.state.currentSong === song
        );
        const newIndex = Math.min(currentIndex + 1, this.state.album.songs.length);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    hoverOn(index) {
        this.setState({ hover: index });
    }

    hoverOff() {
        this.setState({ hover: false });
    }

    handleHover(song, index) {
        var pause = <ion-icon name="pause" />;
        var play = <ion-icon name="play" />;
        var isSameSong = this.state.currentSong === song;

        if (this.state.isPlaying && isSameSong) {
            return pause;
        } else if (this.state.hover === index) {
            return play;
        } else {
            return index + 1;
        }
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
    }

    formatTime(seconds) {
        if (isNaN(seconds) || seconds === 0) {
            return "--:--";
        }
        const minutes = Math.round(seconds / 60);
        const second = Math.round(seconds % 60);
        if (second < 10) {
            return minutes + ":0" + second;
        } else {
            return minutes + ":" + second;
        }
    }

    renderButton(song, index) {
        if (this.state.isPlaying && this.state.currentSong === song) {
            return (
                <button>
                    <span className="ion-pause" />
                </button>
            );
        } else if (this.state.hover === index) {
            return (
                <button>
                    <span className="ion-play" />
                </button>
            );
        } else {
            return <span>{index + 1}</span>;
        }
    }

    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img
                        id="album-cover-art"
                        src={this.state.album.albumCover}
                        alt={this.state.album.title}
                    />
                    <div className="album-details">
                        <h1 id="album-title">{this.state.album.title}</h1>
                        <h2 className="artist">{this.state.album.artist}</h2>
                        <div id="release-info">{this.state.album.releaseInfo}</div>
                    </div>
                </section>
                <table id="song-list">
                    <colgroup>
                        <col id="song-number-column" />
                        <col id="song-title-column" />
                        <col id="song-duration-column" />
                    </colgroup>
                    <tbody>
                    {this.state.album.songs.map((song, index) => (
                        <tr
                            onMouseEnter={() => this.hoverOn(index)}
                            onMouseLeave={() => this.hoverOff()}
                            className="song"
                            key={index}
                            onClick={() => this.handleSongClick(song)}
                        >
                            <td>{this.renderButton(song, index)}</td>
                            <td>{song.title}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <PlayerBar
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    currentTime={this.audioElement.currentTime}
                    duration={this.audioElement.duration}
                    handleSongClick={() =>
                        this.handleSongClick(
                            this.state.currentSong,
                            this.state.currentSongIndex
                        )
                    }
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={e => this.handleTimeChange(e)}
                    formatTime={time => this.formatTime(time)}
                />
            </section>
        );
    }
}
export default Album;
