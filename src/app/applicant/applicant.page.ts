import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
    selector: 'app-applicant',
    templateUrl: './applicant.page.html',
    styleUrls: ['./applicant.page.scss'],
})
export class ApplicantPage implements OnInit {

    isMajorActivated = false;
    isSkillsActivated = false;
    isFormerJobsActivated = false;
    bioBtn: Element;
    skillsBtn: Element;
    formerJobsBtn: Element;

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        this.bioBtn = document.querySelector('#major-col');
        this.skillsBtn = document.querySelector('#skills-col');
        this.formerJobsBtn = document.querySelector('#former-jobs-col');
    }

    onDisplayMajor() {
        this.bioBtn.classList.add('active');
        this.skillsBtn.classList.remove('active');
        this.formerJobsBtn.classList.remove('active');
        this.isMajorActivated = !this.isMajorActivated;
        this.isSkillsActivated = false;
        this.isFormerJobsActivated = false;
    }

    onDisplaySkills() {
        this.skillsBtn.classList.add('active');
        this.bioBtn.classList.remove('active');
        this.formerJobsBtn.classList.remove('active');
        this.isSkillsActivated = !this.isSkillsActivated;
        this.isMajorActivated = false;
        this.isFormerJobsActivated = false;
    }

    onDisplayFormerJobs() {
        this.formerJobsBtn.classList.add('active');
        this.bioBtn.classList.remove('active');
        this.skillsBtn.classList.remove('active');
        this.isFormerJobsActivated = !this.isFormerJobsActivated;
        this.isMajorActivated = false;
        this.isSkillsActivated = false;
    }
}
