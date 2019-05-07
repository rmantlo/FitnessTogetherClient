import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  token: any;

  constructor(private formbuild: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.login = this.formbuild.group({
      username: new FormControl(),
      password: new FormControl()
    })
  }

  onSubmit(): void {
    console.log(this.login.value);
    this.userService.login(this.login.value).subscribe(
      data => {
        console.log(data);
        let data1: any = data;
        localStorage.setItem('token', data1.sessionToken);
        this.token = data1.sessionToken;
      }
    )
  }

}
