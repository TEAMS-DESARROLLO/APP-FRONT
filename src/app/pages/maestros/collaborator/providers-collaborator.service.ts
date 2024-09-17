
import { Injectable } from '@angular/core';
import { CollaboratorInterface } from './collaborator-pagination/collaborator.interface';

@Injectable({
  providedIn: 'root',
})
export class ProvidersCollaboratorService {
  constructor() {}


  fillInterfaceCollaboratorFromRequest(data: any): CollaboratorInterface {
    let interfaceCollaborator: CollaboratorInterface = {
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

    Object.keys(data).forEach((name) => {

      switch (name) {
        case 'idCollaborator':
          interfaceCollaborator.idCollaborator = data[name];
          break;
        case 'lastnameCollaborator':
          interfaceCollaborator.lastName = data[name];
          break;
        case 'namesCollaborator':
          interfaceCollaborator.names = data[name];
          break;
        case 'email':
          interfaceCollaborator.email = data[name];
          break;
        case 'state':
          interfaceCollaborator.state = data[name];
          break;
        case 'idLeader':
          interfaceCollaborator.idLeader = data[name];
          break;
        case 'leaderNames':
          interfaceCollaborator.leaderNames = data[name];
          break;
        case 'idRol':
          interfaceCollaborator.idRol = data[name];
          break;
        case 'rolDescription':
          interfaceCollaborator.rolDescription = data[name];
          break;
        case 'idRegion':
          interfaceCollaborator.idRegion = data[name];
          break;
        case 'descriptionRegion':
          interfaceCollaborator.regionDescription = data[name];
          break;
        case 'idFunctionalLeader':
          interfaceCollaborator.idFunctionalLeader = data[name];
          break;
        case 'namesFuncionalLeader':
          interfaceCollaborator.functionalLeaderNames = data[name];
          break;
        case 'idPractice':
          interfaceCollaborator.idPractice = data[name];
          break;
        case 'descriptionPractice':
          interfaceCollaborator.practiceDescription = data[name];
          break;

        default:
          break;
      }
    });
    return interfaceCollaborator;
  }
}
