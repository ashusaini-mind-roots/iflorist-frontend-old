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


    /* Function to calculate time difference between 2 datetimes (in Timestamp-milliseconds, or string English Date-Time)
     It can also be used the words: NOW for current date-time, and TOMORROW for the next day (the 0:0:1 time)
     Returns an object with this items {days, hours, minutes, seconds, totalhours, totalmin, totalsec}
     */
    diffDateTime(startDT, endDT){
        console.log(typeof startDT + ", " + startDT)
        // JavaScript & jQuery Course - https://coursesweb.net/javascript/
        // if paramerer is string, only the time hh:mm:ss (with, or without AM/PM), create Date object for current date-time,
        // and adds hour, minutes, seconds from paramerer
        //else, if the paramerer is "now", sets Date object with current date-time
        //else, if the paramerer is "tomorrow", sets Date object with current date, and the hour 24 + 1 second
        // else create Date object with date time from startDT and endDT
        if(typeof startDT == 'string' && startDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}[amp ]{0,3}$/i)){
            startDT = startDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/);
            startDT = startDT.toString().split(':');
            var obstartDT = new Date();
            obstartDT.setHours(startDT[0]);
            obstartDT.setMinutes(startDT[1]);
            obstartDT.setSeconds(startDT[2]);
            console.log("pepitostring1: " + obstartDT.getHours())
        }
        else if(typeof startDT == 'string' && startDT.match(/^now$/i)) var obstartDT = new Date();
        else if(typeof startDT == 'string' && startDT.match(/^tomorrow$/i)){
            var obstartDT = new Date();
            obstartDT.setHours(24);
            obstartDT.setMinutes(0);
            obstartDT.setSeconds(1);
            console.log("pepitostring2: " + obstartDT.getHours())
        }
        else var obstartDT = new Date(startDT);

        if(typeof endDT == 'string' && endDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}[amp ]{0,3}$/i)){
            endDT = endDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/);
            endDT = endDT.toString().split(':');
            var obendDT = new Date();
            obendDT.setHours(endDT[0]);
            obendDT.setMinutes(endDT[1]);
            obendDT.setSeconds(endDT[2]);
            console.log("pepitostring3: " + obstartDT.getHours())
        }
        else if(typeof endDT == 'string' && endDT.match(/^now$/i)) var obendDT = new Date();
        else if(typeof endDT == 'string' && endDT.match(/^tomorrow$/i)){
            var obendDT = new Date();
            obendDT.setHours(24);
            obendDT.setMinutes(0);
            obendDT.setSeconds(1);
            console.log("pepitostring4: " + obstartDT.getHours())
        }
        else {
            var obendDT = new Date(endDT)
            console.log("pepitostring5: " + obendDT.getHours())
        };

        // gets the difference in number of seconds
        // if the difference is negative, the hours are from different days, and adds 1 day (in sec.)
        var secondsDiff = (obendDT.getTime() - obstartDT.getTime()) > 0 ? (obendDT.getTime() - obstartDT.getTime()) / 1000 :  (86400000 + obendDT.getTime() - obstartDT.getTime()) / 1000;
        secondsDiff = Math.abs(Math.floor(secondsDiff));

        var oDiff = {

            // object that will store data returned by this function

            days : Math.floor(secondsDiff/86400),
            totalhours : Math.floor(secondsDiff/3600),      // total number of hours in difference
            totalmin : Math.floor(secondsDiff/60),    // total number of minutes in difference
            totalsec : secondsDiff,      // total number of seconds in difference
            hours : 0,
            minutes: 0,
            seconds: 0,
        };
        secondsDiff -= oDiff.days*86400;
        oDiff.hours = Math.floor(secondsDiff/3600);     // number of hours after days

        secondsDiff -= oDiff.hours*3600;
        oDiff.minutes = Math.floor(secondsDiff/60);     // number of minutes after hours

        secondsDiff -= oDiff.minutes*60;
        oDiff.seconds = Math.floor(secondsDiff);     // number of seconds after minutes

        return oDiff;
    }
}