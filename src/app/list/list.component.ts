import { Component } from '@angular/core';

import { Repository } from './../models/repository';

import { MediaPlayer, MediaPlayerClass } from 'dashjs';

@Component({
    selector: 'app-list-component',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent {
    private player: MediaPlayerClass;

    constructor(public repo: Repository) {
        this.player = MediaPlayer().create();
        // this.player.getDebug().setLogToBrowserConsole(false);
        this.player.initialize();
        this.player.setAutoPlay(false);
    }

    selectVideo(id: number) {
        this.repo.selectVideo(id);
        if (this.repo.videos.length === id) {
            const video = document.querySelector('#video'),
                url = this.repo.currentVideo.url;
            this.player.attachView(video as HTMLElement);
            this.player.attachSource(url);
        }
    }
}
