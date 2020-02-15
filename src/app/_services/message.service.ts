import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next( message );
    }
	
	sendMessageReloadStore() {
		this.subject.next();
    }
	
	sendMessageToast(variant:string ,message: string) {
        let messageData = {'variant':variant,'message':message};
        this.subject.next( messageData );
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getMessageToast(): Observable<any> {
        return this.subject.asObservable();
    }
	
	getMessageReloadStore(): Observable<any> {
        return this.subject.asObservable();
    }
}