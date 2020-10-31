import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { ListComponent } from './list/list.component';
import { VideoComponent } from './video/video.component';

import { Repository } from './models/repository';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        ListComponent,
        VideoComponent
    ],
    providers: [
        Repository
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
