import { MedicalService, PatientStatus, ServiceRequest, User, UserType } from 'api';
import Gateway, { ResponseType } from './Gateway';

export default class MedicalServicesApi {
  public static createMedicalService (service: MedicalService, file: any):ResponseType<MedicalService> {
    const form = new FormData();
    form.append('file', file);
    return Gateway.post('/admin/medicalservices', form, {
      title: encodeURIComponent(service.title),
      subtitle: encodeURIComponent(service.subTitle),
      details: encodeURIComponent(service.details),
      price: encodeURIComponent(service.price)
    });
  }

  public static getMedicalServices ():ResponseType<MedicalService[]> {
    return Gateway.get('/admin/medicalservices');
  }

  public static patchMedicalService (id: string, medicalService: MedicalService):ResponseType<MedicalService> {
    return Gateway.patch('/admin/medicalservices', medicalService);
  }

  public static updateMedicalServiceImage (id: string, file: any):ResponseType<string> {
    const form = new FormData();
    form.append('file', file);
    return Gateway.put('/admin/medicalservices/image?id=' + id, form);
  }

  public static deleteMedicalService (id: string):ResponseType<string> {
    return Gateway.delete('/admin/medicalservices?id=' + id);
  }
}
