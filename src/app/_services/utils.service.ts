import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
// import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UtilsService {
    private init_year = 2019;
    constructor() { }

    GetYears(initial_year = undefined, end_year = undefined) {
        if (typeof initial_year === 'undefined') {
            initial_year = this.init_year;
        }
        if (typeof end_year === 'undefined') {
            end_year = this.GetCurrentYear();
        }
        // console.dir([initial_year, end_year]);
        return this.ArrayRange(initial_year, end_year);
    }

    GetCurrentYear () {
        var currentdate = new Date();
        return currentdate.getFullYear();
    }

    ArrayRange(start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    }
    ParseMinutesToHoursFormat(minutes){
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var returnh = h < 10 ? '0' + h : h;
        var returnm = m < 10 ? '0' + m : m;

        return returnh + ':' + returnm;
    }
}