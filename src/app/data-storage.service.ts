import {Injectable, OnInit} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService implements OnInit {

    private visited: boolean;

    constructor() {
        this.visited = !!localStorage.getItem('visited');
    }

    ngOnInit(): void {
    }

    get isVisited() {
        return this.visited;
    }

    setVisited(visited: boolean) {
        if (visited) {
            localStorage.setItem('visited', 'true');
            this.visited = true;
        } else {
            localStorage.removeItem('visited');
            this.visited = false;
        }
    }
}
