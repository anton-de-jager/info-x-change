import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'agents-chats',
  standalone: true,
  templateUrl: './agents-chats.component.html',
  styleUrls: ['./agents-chats.component.scss'],
  imports: [
  ]
})
export class AgentsChatsComponent {
  constructor(
    private router: Router
  ) {
    this.selectPage('Agent Chats');
  }

  selectPage(page: string): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge', // Preserve existing query params
    });
  }
}