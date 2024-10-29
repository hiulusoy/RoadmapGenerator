import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoadingService {
    private _isLoading = new BehaviorSubject<boolean>(false);

    get isLoading() {
        return this._isLoading.asObservable();
    }

    show() {
        this._isLoading.next(true);
    }

    hide() {
        this._isLoading.next(false);
    }
}
