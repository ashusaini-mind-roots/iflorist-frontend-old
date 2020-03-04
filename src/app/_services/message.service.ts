import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();
	private subjectReloadAfterCreate = new Subject<any>();
	private subjectChangeDisplayModeData = new Subject<any>();
	private subjectFilterText = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next( message );
    }
	
	sendMessageReloadStore() {
		this.subjectReloadAfterCreate.next();
    }
	
	sendChangeDisplayModeData(data:boolean) {
		this.subjectChangeDisplayModeData.next(data);
    }
	
	sendMessageToast(variant:string ,message: string) {
        let messageData = {'variant':variant,'message':message};
        this.subject.next( messageData );
    }
	
	sendFilterText(texto: string) {
        this.subjectFilterText.next( texto );
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
	
	getChangeDisplayModeData(): Observable<any> {
        return this.subjectChangeDisplayModeData.asObservable();
    }

    getMessageToast(): Observable<any> {
        return this.subject.asObservable();
    }
	
	getMessageReloadStore(): Observable<any> {
        return this.subjectReloadAfterCreate.asObservable();
    }
	
	getFilterText(): Observable<any> {
        return this.subjectFilterText.asObservable();
    }
}