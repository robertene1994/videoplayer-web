import { Subtitle } from './subtitle.model';

export class Video {
    constructor(
        public id?: number,
        public name?: string,
        public url?: string,
        public subtitles?: Subtitle[]) { }
}
