/**
 * Doctor profile — sourced from kneevorthopaediccenter.com (Home, Why Kneev,
 * Orthopaedic Consultation, Knee & Hip Surgery and Knee Pain pages).
 *
 * NEEDS CLINIC CONFIRMATION before these can be shown:
 *  - experience: the Home page says "over a decade"; the Why Kneev page says
 *    "15+ years". Set ONE confirmed sentence below; null hides it.
 *  - affiliations: the Home page says "Consultant at Manipal & Apollo
 *    Hospitals"; the Why Kneev page lists Apollo, Manipal, Bangalore Hospital
 *    and United Hospital. Set a confirmed list below; null hides it.
 */
import portrait from '../assets/img/doctor-portrait.webp';

export const DOCTOR = {
  name: 'Dr. Amith P. Shetty',
  photo: portrait,
  photoAlt: 'Dr. Amith P. Shetty, orthopaedic surgeon, seated at his consultation desk at Kneev',
  qualifications: ['MBBS', 'MS Orthopaedics', 'Dip SICOT (Belgium)', 'FIJR (Germany)'],
  title: 'Orthopaedic Surgeon — Knee, Hip & Spine',

  experience: null, // e.g. 'Over 15 years of clinical experience in joint replacement and trauma surgery' – CONFIRM
  affiliations: null, // e.g. ['Visiting consultant, ...'] – CONFIRM

  bio: [
    'Dr. Amith P. Shetty is a fellowship-trained orthopaedic surgeon whose practice focuses on the knee, hip and spine. His clinical work covers degenerative joint conditions, sports injuries and joint reconstruction, including primary and revision joint replacement.',
    'At Kneev, every consultation is personally conducted by him. Time is set aside for a detailed history, a systematic examination and a clear explanation of findings, so that patients understand their condition before any treatment decision is made.',
  ],
  focus: [
    'Knee arthritis and knee replacement',
    'Revision knee replacement',
    'ACL and sports knee injuries',
    'Hip conditions and hip replacement',
    'Non-surgical spine care',
    'Orthopaedic trauma',
  ],
  philosophy:
    'Surgery is the last resort, not the first option. Non-surgical treatment is explored first, and surgery is recommended only when it is likely to clearly improve quality of life.',
};
