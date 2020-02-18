import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {DataStorageService} from '../data-storage.service';
import {IonSlides} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit, AfterViewInit {
    @ViewChild(IonSlides, {static: false}) slides: IonSlides;

    // noinspection JSUnusedGlobalSymbols
    slideOpts = {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletElement: 'ion-icon',
            renderBullet(index, className) {
                switch (index) {
                    case 0:
                        return '<ion-icon style="width: 18px; height: 18px; margin: 0 10px;" class="'
                            + className + '" name="globe"></ion-icon>';
                    case 1:
                        return '<ion-icon style="width: 18px; height: 18px; margin: 0 10px;" class="'
                            + className + '" name="school"></ion-icon>';
                    case 2:
                        return '<ion-icon style="width: 18px; height: 18px; margin: 0 10px;" class="'
                            + className + '" name="contacts"></ion-icon>';
                    case 3:
                        return '<ion-icon style="width: 18px; height: 18px; margin: 0 10px;" class="'
                            + className + '" name="happy"></ion-icon>';
                }
            }
        }
    };
    public isLastSlide = false;

    constructor(public dataStorageService: DataStorageService, public router: Router) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        // noinspection JSUnusedLocalSymbols
        this.slides.ionSlideWillChange.subscribe(data => {
            this.slides.getActiveIndex().then(index => {
                this.isLastSlide = index === 3;
            });
        });

        const keyframes: Keyframe[] = [
            {
                width: '18px',
                height: '18px',
                backgroundColor: 'transparent',
                color: '#cccccc'
            },
            {
                width: '32px',
                height: '32px',
                backgroundColor: '#FC8C05',
                color: 'white'
            }
        ];

        const options: KeyframeAnimationOptions = {
            duration: 200,
            fill: 'forwards'
        };

        let currentBullet: HTMLIonIconElement;
        let currentAnimation: Animation;
        // noinspection JSUnusedLocalSymbols
        this.slides.ionSlidesDidLoad.subscribe(data => {
            currentBullet = document.querySelector<HTMLIonIconElement>('.swiper-pagination-bullet-active');
            currentAnimation = currentBullet.animate(keyframes, options);
        });
        // noinspection JSUnusedLocalSymbols
        this.slides.ionSlideWillChange.subscribe(data => {
            currentAnimation.reverse();
            currentBullet = document.querySelector<HTMLIonIconElement>('.swiper-pagination-bullet-active');
            currentAnimation = currentBullet.animate(keyframes, options);
            this.slides.getActiveIndex().then(index => {
                this.isLastSlide = index === 3;
            });
        });
    }

    public async onNavigateToLogIn() {
        this.dataStorageService.setVisited(true);
        await this.router.navigate(['/log-in']);
    }
}
