import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './play-round/play-round.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { GameReviewPageComponent } from './game-review-page/game-review-page.component';

const routes: Routes = [
  {path: '', component: PlayRoundComponent},
  {path: 'teacher', component: LargeDisplayComponent},
  {path: 'review', component: GameReviewPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
