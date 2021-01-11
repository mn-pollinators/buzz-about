import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { from, of, Observable } from 'rxjs';

// Make sure that firebase/auth is included in the main bundle
// (not lazy-loaded, because relying on it to lazy-load was not working)
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private auth: AngularFireAuth) {}

  /**
   * Observable that emits the currently logged in firebase.User.
   *
   * If you subscribe to this observable without being logged in, a new
   * anonymous account will be created.
   */
  currentUser$: Observable<firebase.User> = this.auth.user.pipe(
    switchMap(authUser =>
      authUser ? of(authUser) : from(this.auth.signInAnonymously()).pipe(
        map(cred => cred.user)
      )
    ),
    shareReplay(1)
  );

}
