import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CollaboratorInterface } from '../../../collaborator-pagination/collaborator.interface';

@Component({
  selector: 'app-info-base-collaborator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './info-base-collaborator.component.html',
  styleUrl: './info-base-collaborator.component.css',
})
export class InfoBaseCollaboratorComponent {
  @Input()
  _collaboratorInterface!:CollaboratorInterface ;

  @Input()
  _ramdom: number = 0;


  constructor() {
    this._collaboratorInterface = {
      idCollaborator: '',
      lastName: '',
      names: '',
      email: '',
      state: '',
      idLeader: '',
      leaderNames: '',
      idRol: '',
      rolDescription: '',
      idRegion: '',
      regionDescription: '',
      idFunctionalLeader: '',
      functionalLeaderNames: '',
      idPractice: '',
      practiceDescription: '',
    };

  }



  ngOnInit(): void {

  }

  ngOnChanges(): void {
    console.log(this._collaboratorInterface);
    if(this._collaboratorInterface == undefined){

      this._collaboratorInterface = {
        idCollaborator: '',
        lastName: '',
        names: '',
        email: '',
        state: '',
        idLeader: '',
        leaderNames: '',
        idRol: '',
        rolDescription: '',
        idRegion: '',
        regionDescription: '',
        idFunctionalLeader: '',
        functionalLeaderNames: '',
        idPractice: '',
        practiceDescription: '',
      };

    }
  }
}
