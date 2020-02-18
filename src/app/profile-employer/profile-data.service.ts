import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';


export interface EmployerData {
    biography: string;
    location: {
        current: string;
        homeTown: string;
    };
    degrees: {
        school: string;
        majors: string[];
        enrollDate: Date;
        current: boolean;
        graduationDate: Date;
    }[];
    workExperience: {
        company: string;
        position: string;
        startDate: string;
        current: boolean;
        endDate?: string;
        website?: string;
        details?: string;
    }[];
    funFacts: string;
    passion: string;
    skills: {
        languages: string[],
        technical: string[],
        mySkills: string[]
    };
    gigsAndFreelance: {
        company: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        details?: string;
    }[];
    volunteer: {
        organization: string;
        startDate: Date;
        endDate: Date;
        details?: string;
    }[];
    leadership: {
        organization: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        details?: string;
    }[];
    awardsAndAchievements: {
        title: string;
        date: Date;
        details?: string;
    }[];
    hobbies: string[];
    videos: {
        videoId: string;
        title: string;
        thumbnailURL: string;
        description?: string;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class ProfileDataService {

    today = new Date();
    twentyYearsLater = new Date(this.today.getFullYear() + 20, this.today.getMonth(), this.today.getDate());

    constructor(private angularFirestore: AngularFirestore) {
    }

    getEmployerData(uid: string) {
        return this.angularFirestore.collection('employerData').doc<EmployerData>(uid).valueChanges();
    }

    async updateEmployerData(uid: string, data: Partial<EmployerData>) {
        await this.angularFirestore.collection('employerData').doc<EmployerData>(uid).update(data);
    }

    async storeEmployerData(uid: string, data: Partial<EmployerData>) {
        await  this.angularFirestore.doc(`employerData/${uid}`).set(data);
    }
}
