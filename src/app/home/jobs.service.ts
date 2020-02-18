import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot} from '@angular/fire/firestore';
import {IonInfiniteScroll} from '@ionic/angular';

import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {scan, take, tap} from 'rxjs/operators';

import {User} from 'firebase';

import {AuthService, UserData} from '../auth/auth.service';

export interface Job {
    applicationUntil: Date;
    createdAt: Date;
    description: string;
    filled: boolean;
    payment: number;
    requiredSkills: string[];
    title: string;
    createdBy: string;
    doc?: QueryDocumentSnapshot<Job>;
}

@Injectable({
    providedIn: 'root'
})
export class JobsService implements OnDestroy {

    modal: HTMLIonModalElement;

    private jobsSubject = new BehaviorSubject<Job[]>([]);
    private jobsObservable: Observable<Job[]>;
    private user: User;
    private role: 'student' | 'employer';
    private limit = 10;
    private userSubscription: Subscription;
    private updatingSubscriptions: Subscription[] = [];

    constructor(private authService: AuthService, private angularFirestore: AngularFirestore) {
    }

    /**
     * Subscribing to the user changes to retrieve jobs every time the user changes.
     * @param infiniteScroll The ion infinite scroll element that will display the retrieved jobs.
     */
    init(infiniteScroll: IonInfiniteScroll) {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        this.userSubscription = this.authService.currentUser.subscribe(async user => {
            this.user = user;
            const userData = user ? await this.authService.retrieveUserData(user.uid) : null;
            this.initObservable(user, userData, infiniteScroll);
        });
    }

    /**
     * Retrieves the first package of jobs from the firestore cloud.
     * @param user The current user.
     * @param userData The current user's data.
     * @param infiniteScroll The ion infinite scroll element that will display the retrieved jobs.
     */
    private initObservable(user: User, userData: UserData, infiniteScroll: IonInfiniteScroll) {
        infiniteScroll.disabled = false;
        this.jobsSubject = new BehaviorSubject<Job[]>([]);
        this.role = userData ? userData.role : 'student';
        let jobsCollection: AngularFirestoreCollection<Job>;
        if (this.role === 'student') {
            jobsCollection = this.angularFirestore
                .collection('jobs', ref => {
                    return ref.orderBy('createdAt', 'desc').limit(this.limit);
                });
        } else {
            const uid = user.uid;
            jobsCollection = this.angularFirestore
                .collection('jobs', ref => {
                    return ref
                        .orderBy('createdAt', 'desc')
                        .where('createdBy', '==', uid)
                        .limit(this.limit);
                });
        }

        if (this.updatingSubscriptions.length) {
            this.updatingSubscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
        }

        this.updatingSubscriptions.push(this.mapAndUpdate(jobsCollection, null));

        this.jobsObservable = this.jobsSubject.asObservable().pipe(scan((acc, value) => {
            console.log({acc, value});
            return acc.concat(value);
        }));
    }

    /**
     * Retrieves more jobs from the firestore cloud.
     * @param $event The event object creating when the scrolling event occurs.
     */
    more($event) {
        const currentData = this.jobsSubject.value;

        let jobsCollection: AngularFirestoreCollection<Job>;
        if (this.role === 'student') {
            jobsCollection = this.angularFirestore
                .collection('jobs', ref => {
                    return ref
                        .orderBy('createdAt', 'desc')
                        .limit(this.limit)
                        .startAfter(currentData.length ? currentData[currentData.length - 1].doc : null);
                });
        } else {
            const uid = this.user.uid;
            jobsCollection = this.angularFirestore
                .collection('jobs', ref => {
                    return ref
                        .orderBy('createdAt', 'desc')
                        .where('createdBy', '==', uid)
                        .limit(this.limit)
                        .startAfter(currentData.length ? currentData[currentData.length - 1].doc : null);
                });
        }
        this.mapAndUpdate(jobsCollection, $event);
    }

    /**
     * Maps and updates the current jobs subject and disabling the infinite
     * scroll elements when there are no jobs left to retrieve.
     * @param collection The firestore jobs' collection.
     * @param $event The event object creating when the scrolling event occurs.
     */
    private mapAndUpdate(collection: AngularFirestoreCollection<Job>, $event) {
        return collection.snapshotChanges().pipe(tap(jobs => {
            const values = jobs.map(snap => {
                const data = snap.payload.doc.data();
                const doc = snap.payload.doc;
                return {...data, doc};
            });
            this.jobsSubject.next(values);
            if ($event) {
                $event.target.complete();
                $event.target.disabled = !values.length || values.length < this.limit;
            }
        }), take(1)).subscribe();
    }

    /**
     * Stores a new job in the firestore cloud.
     * @param job A new Job object that will be stored in the firestore cloud.
     */
    async createJob(job: Job) {
        const jobsRef: AngularFirestoreCollection<Job> = this.angularFirestore.collection('jobs');
        return await jobsRef.add(job);
    }

    /**
     * Returns the jobs observable which contains the jobs retrieved from the firestore cloud.
     */
    get jobs() {
        return this.jobsObservable;
    }

    /**
     * Unsubscribe from all the observables' subscriptions.
     */
    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.updatingSubscriptions.length) {
            this.updatingSubscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
        }
    }
}
