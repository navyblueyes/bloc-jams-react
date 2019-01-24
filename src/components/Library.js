import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
    constructor(props) {
        super(props);
        this.state = {albums: albumData};
    }

    render() {
        return (
            <section className='library'>
                <h1> Music Library </h1>
                {
                    this.state.albums.map((album, index) =>
                        <div className='albumColumn'>

                            <div className='albumCoverColumn'>
                                <Link to={`/album/${album.slug}`} key={index}>
                                    <img src={album.albumCover} alt={album.title}/>
                                </Link>
                            </div>
                            <div className='albumInfoColumn'>
                                <Link to={`/album/${album.slug}`} key={index}>
                                    <div>{album.title}</div>
                                    <div>{album.artist}</div>
                                    <div>{album.songs.length} songs</div>
                                </Link>
                            </div>
                        </div>
                    )
                }
            </section>
        );
    }
}
export default Library;