import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario,MyErrorStateMatcher,errorMessages } from '../../Interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('slidePrincipal') slides: IonSlides;
 
  error=false;
  noExist=false;
  pasar=false;
  usuarioexite=false;
  usuario: Usuario = new Usuario();
  usuariolog: Usuario = new Usuario();
  usuarionew: Usuario = new Usuario();
  usuarionew1: Usuario = new Usuario();
  forma: FormGroup;
  logF:NgForm;
  errors = errorMessages;
  matcher = new MyErrorStateMatcher();
  promo=true;
  hide = true;
  slideOpts   = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  }


  constructor(  public router: Router,
                private navCtrl: NavController,
                private authSvc: AuthService,
                private afs: AngularFirestore,
                private fb:FormBuilder,
                ) { 
                  this.authSvc.afAuth.authState.toPromise().then(resp=>{
                    console.log(resp);
                  })
                  this.crearFormulario()
                }

                ngOnInit() {
                
                }

                crearFormulario(){
                  this.forma=this.fb.group({
                    nombre  :['',[Validators.required,Validators.pattern('[a-zA-Z ]{0,254}')] ],
                    apellido:['',[Validators.required,Validators.pattern('[a-zA-Z ]{0,254}')]],
                    email  :['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],
                    genero: ['',Validators.required],
                    fechanacimiento:['',[Validators.required]],
                    rol:['',Validators.required],
                    carrera:['',Validators.required],
                    password   :['',[Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
                 }
                 );}
  async login( form: NgForm ) {
    if(form.invalid){
      Object.values(this.forma.controls).forEach(control=>{
          console.log(control);
          control.markAsTouched();
        })
        return
      }
      try{
        const rep = await this.authSvc.login(this.usuariolog.email, this.usuariolog.password);
        if (rep.uid) {
          
          this.logF=form;
          form.reset()
          const isVerified = this.authSvc.isEmailVerified(rep);
         this.redirectUser(isVerified);
        }else{         
          var error:any=rep;
          if(error.code=='auth/user-not-found'){
            this.noExist=true;
            setTimeout(() => {
                this.noExist=false;
            }, 3000);
            return;
          }else if(error.code=='auth/wrong-password'){
            this.error=true;
            setTimeout(() => {
              this.error=false;
            }, 3000);
            return;
          }
        }

      }catch(err){
          if(err){
           
          }
      }
  
    }
   
    cambiar(){
     
      this.promo=false;
    }
    navegar(){
      this.router.navigate(['/verify-email'])
    }
  async onLoginGoogle() {
    try {
      const user = await this.authSvc.loginGoogle();
      if (user) {
        console.log('User ->', user);
      }
    } catch (error) {
      console.log('Error->', error);
    }
  }

  loginGoogle(){
    this.authSvc.loginwithGoogle().then(resp=>{
      
      if(resp=='redirecionar'){
        this.router.navigate(['main/tabs/tab1']);
      }else if(resp=='existe'){
        alert('Verifique si su cuenta ya esta registrada');
      }
      
    }).catch(err=>{
      alert('Verifique si su cuenta ya esta registrada');
    })

  }

  async register(forma:FormGroup){
    if(this.forma.invalid){
      console.log('entra');
  
      return Object.values(this.forma.controls).forEach(control=>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched()) ;
          }else{
            control.markAsTouched();
            return;
          }
        });
      
      }
        try {
          
     
          const user= await this.authSvc.registro(this.usuario);
          if(user){
              
              this.router.navigate(['/verify-email']);
              this.mostrarLogin();
              this.resetiar();
              this.usuario=this.usuarionew1;
          }
       
        } catch (error) {
          if(error.code=="auth/email-already-in-use"){
              this.usuarioexite=true;
              setTimeout(() => {
                this.usuarioexite=false;
              }, 3000);
          } 
        
        }  
  }


llenarDatos(forma:FormGroup){
 
    this.usuario.nombre=forma.get('nombre').value;
    this.usuario.apellido=forma.get('apellido').value;
    this.usuario.email=forma.get('email').value;
    this.usuario.genero=forma.get('genero').value;
    this.usuario.fechanacimiento=this.cambiarFecha(forma.get('fechanacimiento').value);
    this.usuario.rol=forma.get('rol').value;
    this.usuario.carrera=forma.get('carrera').value;
  
}
resetiar(){
  this.forma.reset({
    nombre:'',
    apellido:'',
    email:'',
    genero:'',
    fechanacimiento:'',
    rol:'',
    carrera:'',
    password:'',
  })
}


  


  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.usuariolog=this.usuarionew;
    
      this.logF.resetForm();
      this.router.navigate(['main/tabs/tab1']);
    } else {
      this.usuariolog=this.usuarionew;
      
      this.logF.resetForm();
      this.router.navigate(['verify-email']);
    }
  }

  mostrarLogin() {
    this.pasar=false;
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
    this.resetiar();
    this.usuario=this.usuarionew1;
  }

  mostrarRegistro() {
    this.pasar=true;
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  cambiarFecha(date:string){
    if(date==undefined || date==null || date==""){
      return null;
    }else{
      let f1=new Date(date);
      return f1;
    }   
  }
  
}

