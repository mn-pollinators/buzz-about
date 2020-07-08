import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-anon-auth-test',
  templateUrl: './anon-auth-test.component.html',
  styleUrls: ['./anon-auth-test.component.scss']
})
export class AnonAuthTestComponent implements OnInit {

  constructor(public auth: AngularFireAuth) { }

  public JSON = JSON;

  ngOnInit(): void {
  }

  anonSignIn() {
    this.auth.signInAnonymously();
  }

  normalSignIn() {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

}
