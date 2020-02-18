import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {DataStorageService} from '../data-storage.service';
import {LanguageService} from '../language.service';

@Injectable({
    providedIn: 'root'
})
export class IntroGuard implements CanActivate {

    constructor(private router: Router, private dataStorageService: DataStorageService, private languageService: LanguageService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot):
        Observable<boolean | UrlTree> |
        Promise<boolean | UrlTree> |
        boolean |
        UrlTree {
        if (!this.languageService.isLanguageSetByUser) {
            return this.router.createUrlTree(['/select-language']);
        } else if (this.dataStorageService.isVisited) {
            return this.router.createUrlTree(['/']);
        }
        return true;
    }
}
