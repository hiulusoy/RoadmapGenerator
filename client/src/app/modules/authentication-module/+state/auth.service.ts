import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseService} from "../../../../shared/services/base.service";
import {UserModel} from "../model/model";

declare var window: any;

@Injectable()
export class AuthService extends BaseService {

    constructor(http: HttpClient) {
        super(http);
    }

    signIn(email: string, password: string): Observable<UserModel> {
        let body = JSON.stringify({email: email, password: password});
        return this.post<any, UserModel>(`/authenticate`, body);
    }


    signOut(): Observable<any> {
        return this.get(`/authenticate/logout`);
    }

    forgotPassword(email: string): Observable<any> {
        const body = {
            email: email
        };

        return this.post(`/authenticate/forgot`, body);
    }

    resetPassword(id, token, password): Observable<any> {
        let body = JSON.stringify({
            id: id,
            token: token,
            password: password,
        });

        return this.post(`/authenticate/reset`, body);
    }

    updatePassword(email, currentPassword, newPassword): Observable<any> {
        let body = JSON.stringify({
            email,
            currentPassword,
            newPassword,
        });

        return this.post(`/authenticate/update`, body);
    }

    userExists(email): Observable<any> {
        let body = JSON.stringify({
            email: email,
        });
        return this.post(`/authenticate/exists`, body);
    }

    register(data): Observable<any> {
        let body = JSON.stringify(data);
        return this.post(`/register`, body);
    }
}
