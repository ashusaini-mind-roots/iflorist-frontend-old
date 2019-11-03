import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageToastService {
    private subject = new Subject<any>();

    sendMessage(severity:string ,summary: string, detail:string) {
        let messageData = {'severity':severity,'summary':summary,'detail':detail};
        this.subject.next( messageData );
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}