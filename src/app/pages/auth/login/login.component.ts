import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { take } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
    form!: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    };

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: { email: string; password: string } = this.form.value;

    this.auth.login(credentials).pipe(take(1)).subscribe({
      next: (res: { token: string }) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        this.errorMessage = 'Credenciales inválidas o error de red.', err;
        this.isLoading = false;
      }
    });
  }
}
