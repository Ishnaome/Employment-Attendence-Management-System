// app/api/products/route.ts
import { adminDoctorNotificationEmail, appointmentApprovalToPatient, appointmentCancledToPatient, appointmentConfirmationToUser, appointmentNotificationToDoctor, appointmentRescheduledToPatient, doctorConfirmationEmail } from '@/lib/mail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, doctor, patient, newDate, reason, problem, notes } = body;
    console.log({type, doctor, patient})
    // Validate type
    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { message: 'Missing or invalid "type"' },
        { status: 400 }
      );
    }
    
    if(type.includes("doctor")) {
      if ( !doctor || !doctor.email) {
      return NextResponse.json(
        { message: 'Missing or invalid "doctor" object. Required: { name, email }' },
        { status: 407 }
      );
     }
     if(type.includes("reg")){
      await doctorConfirmationEmail(doctor.name, doctor.email);
      await adminDoctorNotificationEmail(doctor.name, doctor.email, doctor.phoneNumber, doctor.specialization, doctor.clinicAddress, doctor.message);
      
     }
     if(type.includes("appointment")){
      await appointmentNotificationToDoctor(doctor.name, doctor.email, newDate, problem, notes, patient)
     }
     if(type.includes("cancel")){
      await appointmentCancledToPatient(doctor.name, doctor.email, newDate);
      await appointmentCancledToPatient(patient.name, patient.email, newDate);
     }
    }

    if(type.includes("patient")){
      // Validate patient object
      if ( !patient || !patient.email ) {
        return NextResponse.json(
          { message: 'Missing or invalid "patient" object. Required: { name, email }' },
          { status: 408 }
        );
      }
      if(type.includes("appointment")){
        await appointmentConfirmationToUser(patient.name, doctor.name, patient.email);
      }
      
      if(type.includes("approval")){
        await appointmentApprovalToPatient(patient.name, patient.email, doctor.name, patient.address);
      }

      if(type.includes("reschedule")){
        await appointmentRescheduledToPatient(patient.name, patient.email, doctor.name, newDate, newDate, patient.address, reason)
        await appointmentRescheduledToPatient(doctor.name, doctor.email, patient.name, newDate, newDate, patient.address, reason)
      }

    }
  
    // You can proceed to use type, doctor.name/email, and patient.name/email
    console.log('Validated payload:', { type, doctor, patient });

    return NextResponse.json({ message: 'Mail sent successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Error processing request', error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Unknown error occurred.' },
      { status: 500 }
    );
  }
}

