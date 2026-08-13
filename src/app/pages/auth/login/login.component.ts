import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { take } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  formLogin!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formLogin.valid) {
      console.log('Formulario enviado:', this.formLogin.value);
    };
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    };

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: { email: string; password: string } = this.formLogin.value;

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
