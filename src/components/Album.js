import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
    constructor(props) {
        super(props);

        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            duration: album.songs[0].duration,
            isPlaying: false,
        };
    }

    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
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
                    {this.state.album.songs.map((song, index) =>
                        <tr>
                            <td>{this.renderButton(song, index)}</td>
                            <td>{song.title}</td>
                            <td>{this.formatTime(song.duration)}</td>
                        </tr>
                    )
                    }
                    </tbody>
                </table>
            </section>
        );
    }
}

export default Album;