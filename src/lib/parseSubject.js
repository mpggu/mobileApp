'use strict';

import { Subjects } from '../Constants';

export default function parseSubject(plan) {
  if (!plan.fach) {
    return '';
  }

  const grade = plan.klasse;
  let subject = plan.fach.replace(/\d+/g, '').toLowerCase();

  if (grade.startsWith('E') && subject[subject.length - 1] === 'e') {
    subject = subject.slice(0, -1);
  }

  return Subjects[subject] || plan.fach;
}