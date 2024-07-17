import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import SweetAlertIcon from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }

  message_error(title:string, text:string){
    const rpta = Swal.fire({
      title: title,
      text: text,
      icon: "error"
    });


    return rpta;

  }

  message_ok(title:string, text:string){
    const rpta = Swal.fire({
      title: title,
      text: text,
      icon: "success"
    });


    return rpta;

  }

  message_question(icon:string,title:string, text:string,textConfirmation:string,textCancel:string ){


    const rpta = Swal.fire({
      title: title,
      text: text ,
      //icon: 'question' ,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3FB579',
      confirmButtonText: textConfirmation,
      cancelButtonText: textCancel
    }).then( result => {

      if(result.isConfirmed ){
        return true;
      }else{
        return false
      }
    });

    this.setIcon(icon);

    return rpta;

  }



  setIcon(icon:string){

    switch (icon) {
      case 'success':
        Swal.update({
          icon:icon
        })
        break;
      case 'error':
        Swal.update({
          icon:icon
        })
        break;
      case 'warning':
        Swal.update({
          icon:icon
        })
        break;
      case 'info':
        Swal.update({
          icon:icon
        })
        break;
      case 'question':
        Swal.update({
          icon:icon
        })
        break;

      default:
        break;
    }

  }
}
