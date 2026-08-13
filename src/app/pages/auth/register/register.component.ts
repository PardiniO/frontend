import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { take } from "rxjs/operators";
import { group } from '@angular/animations';

/*
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('passwordConfirm');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};
*/

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent /*implements OnInit*/ {
  formRegister!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirm = group.get('passwordConfirm')?.value;

      return password === confirm ? null : { passwordMatchValidator: true };
    }
  
    this.formRegister = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
    }, {
      validators: [passwordMatchValidator]
    });
  }
  onSubmit() {
    if (this.formRegister.valid) {
      console.log(this.formRegister.value);
    }
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    };

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.formRegister.value;
    const credentials = { username, email, password };

    this.auth.login(credentials).pipe(take(1)).subscribe({
      next: (res: { token: string }) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      error: (err: unknown) => {
        this.errorMessage = 'Error al registrarse: ', err;
        this.isLoading = false;
      }
    });
  }
}
