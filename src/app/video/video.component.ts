import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { Repository } from '../models/repository';
import { Ball } from './../models/ball.model';

@Component({
    selector: 'app-video-component',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css'],
})
export class VideoComponent implements AfterViewInit {
    @ViewChild('videoRef')
    private video;
    @ViewChild('canvas')
    private canvas;

    private readonly PLAY_URL = '../../assets/img/play.png';
    private readonly PAUSE_URL = '../../assets/img/pause.png';
    private readonly MUTE_URL = '../../assets/img/mute.png';
    private readonly UNMUTE_URL = '../../assets/img/unmute.png';
    private readonly PROGRESS_BAR_WIDTH = 640;
    private readonly VOLUME_BAR_HEIGHT = 360;

    volumeHeight: string = this.VOLUME_BAR_HEIGHT + 'px';
    volumeMarginTop = '0px';
    progressWidth = '0px';
    currentTime = '00:00';
    duration = '00:00';
    togglePlayState = 'Play';

    toggleMuteState = 'Mute';
    togglePlayUrl: string = this.PLAY_URL;
    toggleMuteUrl: string = this.MUTE_URL;

    // Canvas Animation
    showAnimation = false;
    ball: Ball;
    context: CanvasRenderingContext2D;
    animationId: number;

    constructor(public repo: Repository) {}

    ngAfterViewInit() {
        this.video.nativeElement.addEventListener('loadedmetadata', (event) => this.loadedMetadata(event));
        this.video.nativeElement.addEventListener('timeupdate', (event) => this.currentTimeUpdate(event));
        this.video.nativeElement.addEventListener('ended', (event) => this.ended(event));
        this.loadCanvasAnimation();
    }

    togglePlay() {
        if (this.video.nativeElement.paused === false) {
            this.video.nativeElement.pause();
            this.togglePlayState = 'Play';
            this.togglePlayUrl = this.PLAY_URL;
        } else {
            this.video.nativeElement.play();
            this.togglePlayState = 'Pause';
            this.togglePlayUrl = this.PAUSE_URL;
        }
    }

    back() {
        this.video.nativeElement.currentTime -= 10.0;
    }

    forward() {
        this.video.nativeElement.currentTime += 10.0;
    }

    isNotPossibleToTurnDown(): boolean {
        return this.video.nativeElement.volume === 0.0;
    }

    isNotPossibleToTurnUp(): boolean {
        return this.video.nativeElement.volume === 1.0;
    }

    turnDown() {
        this.changeVolume(this.video.nativeElement.volume - 0.1);
    }

    turnUp() {
        this.changeVolume(this.video.nativeElement.volume + 0.1);
    }

    private changeVolume(changeTo) {
        if (this.video.nativeElement.muted) {
            this.toggleMute();
        }
        if (changeTo > 1.0) {
            changeTo = 1.0;
        } else if (changeTo < 0.0) {
            changeTo = 0.0;
        }
        this.volumeHeight = this.VOLUME_BAR_HEIGHT * changeTo + 'px';
        this.volumeMarginTop = this.VOLUME_BAR_HEIGHT - this.VOLUME_BAR_HEIGHT * changeTo + 'px';
        this.video.nativeElement.volume = changeTo;
    }

    toggleMute() {
        let changeTo;
        if (this.video.nativeElement.muted) {
            this.video.nativeElement.muted = false;
            this.toggleMuteState = 'Mute';
            this.toggleMuteUrl = this.MUTE_URL;
            changeTo = 1.0;
        } else {
            this.video.nativeElement.muted = true;
            this.toggleMuteState = 'Unmute';
            this.toggleMuteUrl = this.UNMUTE_URL;
            changeTo = 0.0;
        }
        this.volumeHeight = this.VOLUME_BAR_HEIGHT * changeTo + 'px';
        this.volumeMarginTop = this.VOLUME_BAR_HEIGHT - this.VOLUME_BAR_HEIGHT * changeTo + 'px';
        this.video.nativeElement.volume = changeTo;
    }

    stop() {
        this.video.nativeElement.currentTime = 0;
        this.video.nativeElement.pause();
        this.clear();
    }

    disableSubtitles() {
        for (let i = 0; i < this.video.nativeElement.textTracks.length; i++) {
            this.video.nativeElement.textTracks[i].mode = 'disabled';
        }
    }

    enableSubtitle(subtitle: string) {
        for (let i = 0; i < this.video.nativeElement.textTracks.length; i++) {
            if (this.video.nativeElement.textTracks[i].language === subtitle) {
                this.video.nativeElement.textTracks[i].mode = 'showing';
            } else {
                this.video.nativeElement.textTracks[i].mode = 'disabled';
            }
        }
    }

    private clear() {
        this.togglePlayState = 'Play';
        this.togglePlayUrl = this.PLAY_URL;
        this.progressWidth = '0px';
        this.currentTime = '00:00';
        this.duration = '00:00';
    }

    private loadCanvasAnimation() {
        this.context = this.canvas.nativeElement.getContext('2d');
        this.ball = new Ball(100, 100, 5, 2, 25);
        this.ball.draw(this.context);
    }

    private toggleCanvasAnimation() {
        this.showAnimation = !this.showAnimation;
        if (!this.showAnimation) {
            this.canvas.nativeElement.style.display = 'none';
            window.cancelAnimationFrame(this.animationId);
        } else {
            this.canvas.nativeElement.style.display = 'block';
            this.animationId = window.requestAnimationFrame(() => {
                this.paintFrame(this);
            });
        }
    }

    private paintFrame(state) {
        const width = state.canvas.nativeElement.width,
            height = state.canvas.nativeElement.height;
        state.context.clearRect(0, 0, width, height);
        state.ball.draw(state.context);
        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;

        if (state.ball.y + state.ball.radius > state.canvas.nativeElement.height || state.ball.y - state.ball.radius < 0) {
            state.ball.vy = -state.ball.vy;
        }
        if (state.ball.x + state.ball.radius > state.canvas.nativeElement.width || state.ball.x - state.ball.radius < 0) {
            state.ball.vx = -state.ball.vx;
        }

        state.animationId = window.requestAnimationFrame(() => {
            this.paintFrame(this);
        });
    }

    // EVENTS
    private ended(evt) {
        this.clear();
    }

    private loadedMetadata(evt) {
        this.clear();
        this.duration = this.video.nativeElement.duration.toFixed(2);
    }

    private currentTimeUpdate(evt) {
        this.currentTime = this.video.nativeElement.currentTime.toFixed(2);
        // if currentTime = 5 seconds and duration = 10 seconds. Being max = 640 => 5*640/10 = 320 that is, a half
        this.progressWidth = (this.video.nativeElement.currentTime * this.PROGRESS_BAR_WIDTH) / this.video.nativeElement.duration + 'px';
    }

    changePosition(evt) {
        // if offsetX = 320. Being max = 640 and duration = 10 seconds => 320*10/640 = 5 that is the current time of the video
        const newTime = (evt.offsetX * this.video.nativeElement.duration) / this.PROGRESS_BAR_WIDTH; // from size to seconds
        this.video.nativeElement.currentTime = newTime; // update the position of the video
        this.progressWidth = evt.offsetX + 'px'; // update the progress bar
    }
}
