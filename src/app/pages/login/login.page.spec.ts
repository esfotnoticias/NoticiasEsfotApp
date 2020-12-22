import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GooglePlus} from '@ionic-native/google-plus/ngx'
describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(),FormsModule,ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,RouterTestingModule.withRoutes([]),
        MaterialModule,BrowserAnimationsModule
      ],
      providers:[FormBuilder, GooglePlus]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia validar que el nombre solo puede contener letras', ()=>{
    let titulo=component.forma.controls['nombre'];
    let errors={};
    errors=titulo.errors || {};
    titulo.setValue('Daniel');
    errors=titulo.errors || {};
    expect(errors['pattern']).toBeFalsy();
  })  

  it('Deberia validar que el apellido solo puede contener letras', ()=>{
    let titulo=component.forma.controls['apellido'];
    let errors={};
    errors=titulo.errors || {};
    titulo.setValue('Casagallo');
    errors=titulo.errors || {};
    expect(errors['pattern']).toBeFalsy();
  }) 

  it('Deberia validar que el rol es obligatorio', ()=>{
    let titulo=component.forma.controls['rol'];
    let errors={};
    errors=titulo.errors || {};
    titulo.setValue('estudiante');
    errors=titulo.errors || {};
    expect(errors['required']).toBeFalsy();
  })  

  it('Deberia validar que seleccione una carrera', ()=>{
    let titulo=component.forma.controls['carrera'];
    let errors={};
    errors=titulo.errors || {};
    titulo.setValue('tsds');
    errors=titulo.errors || {};
    expect(errors['required']).toBeFalsy();
  })  
});
