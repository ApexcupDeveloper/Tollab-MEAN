import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs';

const flyInOut = trigger('flyInOut', [
    state('in', style({
        transform: 'translateY(0)',
        opacity: 1
    })),
    transition('void => *', [
        style({
            transform: 'translateY(-100%)',
            opacity: 0
        }),
        animate(100)
    ]),
    transition('* => void', [
        animate(100, style({
            transform: 'translateY(-100%)',
            opacity: 0
        }))
    ])
]);

@Component({
    selector: 'app-card-details',
    templateUrl: './card-details.component.html',
    styleUrls: ['./card-details.component.scss'],
    animations: [flyInOut]
})
export class CardDetailsComponent implements OnInit {

    @Input() details: { title: string, value: any }[];
    @Input() currentDetails: { card: string, index: number };
    @Input() activeDetails: Observable<{ card: string, index: number }[]>;

    constructor() {
    }

    ngOnInit() {
    }

    filterDetails(details: any[]) {
        return details.filter(detail => !!detail);
    }

    isActive(activeDetails: {card: string; index: number}[]) {
        let isActive = false;
        activeDetails.forEach(activeDetail => {
            const isEqual = this.currentDetails.card === activeDetail.card && this.currentDetails.index === activeDetail.index;
            isActive = isEqual ? isEqual : isActive;
        });
        return isActive;
    }
}
