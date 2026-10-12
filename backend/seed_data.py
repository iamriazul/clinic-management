"""
Seed script to create initial data for development.
Run: python manage.py shell < seed_data.py
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic_management.settings')
django.setup()

from apps.accounts.models import User
from apps.doctors.models import Doctor
from apps.patients.models import Patient

print("Seeding database...")

# Create superuser/admin
if not User.objects.filter(username='admin').exists():
    admin_user = User.objects.create_superuser(
        username='admin',
        email='admin@clinic.com',
        password='admin123',
        first_name='System',
        last_name='Admin',
        role='admin'
    )
    print("  Created admin user: admin / admin123")
else:
    admin_user = User.objects.get(username='admin')
    print("  Admin user already exists.")

# Create receptionist
if not User.objects.filter(username='receptionist').exists():
    receptionist = User.objects.create_user(
        username='receptionist',
        email='receptionist@clinic.com',
        password='recep123',
        first_name='Sarah',
        last_name='Johnson',
        role='receptionist'
    )
    print("  Created receptionist: receptionist / recep123")
else:
    print("  Receptionist already exists.")

# Create doctor users and profiles
doctors_data = [
    {
        'username': 'dr.smith',
        'email': 'smith@clinic.com',
        'password': 'doctor123',
        'first_name': 'John',
        'last_name': 'Smith',
        'specialization': 'Cardiology',
        'phone': '555-0101',
        'consultation_fee': 150.00,
    },
    {
        'username': 'dr.chen',
        'email': 'chen@clinic.com',
        'password': 'doctor123',
        'first_name': 'Emily',
        'last_name': 'Chen',
        'specialization': 'Dermatology',
        'phone': '555-0102',
        'consultation_fee': 120.00,
    },
    {
        'username': 'dr.patel',
        'email': 'patel@clinic.com',
        'password': 'doctor123',
        'first_name': 'Raj',
        'last_name': 'Patel',
        'specialization': 'Orthopedics',
        'phone': '555-0103',
        'consultation_fee': 180.00,
    },
    {
        'username': 'dr.wilson',
        'email': 'wilson@clinic.com',
        'password': 'doctor123',
        'first_name': 'Lisa',
        'last_name': 'Wilson',
        'specialization': 'Pediatrics',
        'phone': '555-0104',
        'consultation_fee': 100.00,
    },
]

for doc_data in doctors_data:
    if not User.objects.filter(username=doc_data['username']).exists():
        doc_user = User.objects.create_user(
            username=doc_data['username'],
            email=doc_data['email'],
            password=doc_data['password'],
            first_name=doc_data['first_name'],
            last_name=doc_data['last_name'],
            role='doctor'
        )
        Doctor.objects.create(
            user=doc_user,
            name=f"{doc_data['first_name']} {doc_data['last_name']}",
            specialization=doc_data['specialization'],
            phone=doc_data['phone'],
            email=doc_data['email'],
            consultation_fee=doc_data['consultation_fee'],
        )
        print(f"  Created doctor: {doc_data['username']} / {doc_data['password']}")
    else:
        print(f"  Doctor {doc_data['username']} already exists.")

# Create sample patient
if not User.objects.filter(username='patient1').exists():
    patient_user = User.objects.create_user(
        username='patient1',
        email='patient1@example.com',
        password='patient123',
        first_name='Alice',
        last_name='Brown',
        role='patient'
    )
    Patient.objects.create(
        user=patient_user,
        name='Alice Brown',
        date_of_birth='1990-05-15',
        gender='female',
        phone='555-0201',
        email='patient1@example.com',
        address='123 Main St, City',
    )
    print("  Created patient: patient1 / patient123")
else:
    print("  Patient1 already exists.")

print("\nSeed data complete!")
print("\n--- Login Credentials ---")
print("Admin:        admin / admin123")
print("Receptionist: receptionist / recep123")
print("Doctor:       dr.smith / doctor123")
print("Patient:      patient1 / patient123")
