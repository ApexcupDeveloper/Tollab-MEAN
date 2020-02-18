import {Injectable, OnDestroy} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

const LANGUAGE_KEY = 'SELECTED_LANGUAGE';

@Injectable({
    providedIn: 'root'
})
export class LanguageService implements OnDestroy {

    selectedLanguage: string = null;
    subscription: Subscription = null;

    constructor(private translateService: TranslateService) {
        this.selectedLanguage = localStorage.getItem(LANGUAGE_KEY);
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            if (event.lang === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        });
    }

    initializeAppLanguage() {
        // TODO: Re-add language options.
        // const browserLanguage = this.translateService.getBrowserLang();
        // const language = browserLanguage ? browserLanguage : 'en';
        const language = 'en';
        this.translateService.setDefaultLang(language);
        const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (storedLanguage) {
            this.setLanguage(storedLanguage).then(() => {
                this.selectedLanguage = storedLanguage;
            });
        }
    }

    getLanguages() {
        return [
            {
                title: 'selectLanguage.languages.english',
                key: 'en',
                flagUrl: 'assets/img/flag-usa.png',
                alt: 'American Flag'
            },
            {
                title: 'selectLanguage.languages.arabic',
                key: 'ar',
                flagUrl: 'assets/img/flag-palestine.png',
                alt: 'Palestinian Flag'
            }
        ];
    }

    async setLanguage(language) {
        await this.translateService.use(language);
        this.selectedLanguage = language;
        localStorage.setItem(LANGUAGE_KEY, language);
        document.documentElement.lang = language;
    }

    get isLanguageSetByUser(): boolean {
        return !!this.selectedLanguage;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
