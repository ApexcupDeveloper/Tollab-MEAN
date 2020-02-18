import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LanguageService} from '../language.service';

@Injectable({
    providedIn: 'root'
})
export class SelectLanguageGuard implements CanActivate {

    constructor(private languageService: LanguageService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot):
        Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean |
        UrlTree {
        return this.languageService.isLanguageSetByUser ? this.router.createUrlTree(['/']) : true;
    }
}
