import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from 'src/app/material.module';
import { environment } from 'src/environments/environment';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx'
import { DocumentViewer} from '@ionic-native/document-viewer/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';

import { FCM } from '@ionic-native/fcm/ngx';
import { Tab2Page } from './tab2.page';
import { GooglePlus} from '@ionic-native/google-plus/ngx'
describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule,FormsModule,ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule,
        RouterTestingModule.withRoutes([]),MaterialModule,BrowserAnimationsModule
      ],
      providers:[FormBuilder, GooglePlus,File,  Camera,
        FCM,
        FileTransfer,
        FileOpener,
        DocumentViewer,
        YoutubeVideoPlayer,]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia validar que ingrese un titulo ya que es un campo obligatorio', ()=>{
    let titulo=component.firstFormGroup.controls['tituloPost'];
    let errors={};
    errors=titulo.errors || {};
    titulo.setValue('Publicacion app prueba');
    errors=titulo.errors || {};
    expect(errors['required']).toBeFalsy();
  });

it('Deberia validar que ingrese una descripción ya que es un campo obligatorio', ()=>{
  let titulo=component.firstFormGroup.controls['descripcionPost'];
  let errors={};
  errors=titulo.errors || {};
  titulo.setValue('Prueba unitaria realiza en ionic para validar el campo obligatorio');
  errors=titulo.errors || {};
  expect(errors['required']).toBeFalsy();
})  


it('Deberia validar que ingrese un número telefónico y se ingresen números', ()=>{    
  let titulo=component.firstFormGroup.controls['telPost'];
  let errors={};
  errors=titulo.errors || {};
  titulo.setValue('3031245786');
  errors=titulo.errors || {};
  expect(errors['pattern']).toBeFalsy();
})  

it('Deberia validar que ingrese un número telefónico y su tamaño máximo sea 10', ()=>{   
  let titulo=component.firstFormGroup.controls['telPost'];
  let errors={};
  errors=titulo.errors || {};
  titulo.setValue('3031245786');
  errors=titulo.errors || {};
  expect(errors['maxLength']).toBeFalsy();
})  

it('Deberia validar que seleccione un tipo de publicación', ()=>{   
  let titulo=component.firstFormGroup.controls['tipoPost'];
  let errors={};
  errors=titulo.errors || {};
  titulo.setValue('Eventos');
  errors=titulo.errors || {};
  expect(errors['required']).toBeFalsy();
}) 

});
