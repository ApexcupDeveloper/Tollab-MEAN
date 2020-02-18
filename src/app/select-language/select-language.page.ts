import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../language.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-select-language',
    templateUrl: './select-language.page.html',
    styleUrls: ['./select-language.page.scss'],
})
export class SelectLanguagePage implements OnInit {

    languages: {
        title: string,
        key: string,
        flagUrl: string,
        alt: string
    }[];

    selectedLanguage: string;

    constructor(public languageService: LanguageService, public router: Router) {
    }

    ngOnInit() {
        this.languages = this.languageService.getLanguages();
    }

    onSelectLanguage(language: string) {
        this.selectedLanguage = language;
    }

    async onFinish() {
        await this.languageService.setLanguage(this.selectedLanguage);
        await this.router.navigate(['/intro']);
    }
}
