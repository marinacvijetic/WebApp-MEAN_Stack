import { Component, OnInit } from '@angular/core';
import { UsersService } from '@project/users';

@Component({
  selector: 'sunny-cookies-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'sunny-cookies';
  
  constructor(
    private userService: UsersService
  ){

  }

  ngOnInit(){
    this.userService.initAppSession();
  };

  
}
