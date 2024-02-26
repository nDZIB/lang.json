import { Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskNewComponent } from './components/task-new/task-new.component';
import { TaskViewComponent } from './components/task-view/task-view.component';

export const routes: Routes = [
  {
    path: '**',
    component: TaskViewComponent
  },
  // {
  //   path: '',
  //   component: TasksComponent
  // },
  // {
  //   path: 'new',
  //   component: TaskNewComponent
  // },
  // {
  //   path: 'tasks/:slug',
  //   component: TaskViewComponent
  // }
];
