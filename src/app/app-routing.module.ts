import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './play-round/play-round.component';
import { EntryScreenComponent } from './entry-screen/entry-screen.component';

const routes: Routes = [
  {path: "", component: EntryScreenComponent},
  {path:"ar", component: PlayRoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
