import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Video } from './video.model';

import { apiUrlPlaylist, apiUrlVideo, apiUrlDash } from './../app.config';

@Injectable()
export class Repository {
    videos: Video[] = [];
    currentVideo: Video;

    constructor(private http: Http) {
        this.getVideos();
    }

    getVideos() {
        this.getPlaylist().then((playlist) => {
            this.videos = playlist;
            for (let i = 0; i < this.videos.length; i++) {
                if (i === 0) {
                    this.selectVideo(this.videos[i].id);
                }
                this.videos[i].url = `${apiUrlVideo}${this.videos[i].url}`;
                if (this.videos[i].subtitles && this.videos[i].subtitles.length > 0) {
                    for (let j = 0; j < this.videos[i].subtitles.length; j++) {
                        this.videos[i].subtitles[j].url = `${apiUrlVideo}${this.videos[i].subtitles[j].url}`;
                    }
                }
            }
            this.getMpegDashVideo();
        });
    }

    selectVideo(id: number) {
        this.currentVideo = this.videos.find((item) => item.id === id);
    }

    getPlaylist() {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http
            .get(apiUrlPlaylist, { headers })
            .toPromise()
            .then((response) => {
                return response.json() as Video[];
            });
    }

    getMpegDashVideo() {
        const id = this.videos.length + 1,
            manifest = `${apiUrlDash}/manifest.mpd`;
        this.videos.push(new Video(id, 'Avengers (Mpeg-Dash)', manifest));
    }
}
