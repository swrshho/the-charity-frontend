import { messages } from '@camp/messages';
import { z } from 'zod';

import type { City } from './Country';
import { cities } from './Country';
import { type Gender } from './Gender';
import { genders } from './Gender';
import type { Religion } from './Religions';
import { religions } from './Religions';

const numberRegex = /^[0-9]*[\u0660-\u0669\u06F0-\u06F90-9]*$/;

export const householderIdentitySchema = {
  name: () =>
    z
      .string()
      .trim()
      .min(
        3,
        messages.householder.householderIdentityForm.validation.nameMinLength,
      ),
  surname: () =>
    z
      .string()
      .trim()
      .min(
        3,
        messages.householder.householderIdentityForm.validation.nameMinLength,
      )
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  fatherName: () =>
    z
      .string()
      .trim()
      .min(
        3,
        messages.householder.householderIdentityForm.validation
          .fatherNameMinLength,
      )
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  nationalId: () =>
    z
      .string()
      .min(
        10,
        messages.householder.householderIdentityForm.validation
          .nationalIdMinLength,
      )
      .regex(
        numberRegex,
        messages.householder.householderIdentityForm.validation
          .invalidNationalId,
      )
      .trim()
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  gender: () =>
    z
      .union([z.literal(genders[0]), z.literal(genders[1])])
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  nationality: () =>
    z
      .string()
      .trim()
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  religion: () =>
    z
      .literal(religions[0])
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  cityOfBirth: () =>
    z
      .literal(cities[0])
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
  issuedAt: () =>
    z
      .literal(cities[0])
      .nullish()
      .or(z.literal(''))
      .transform(e => (e === '' || e === null ? undefined : e)),
};

export type HouseholderStatus = 'completed' | 'draft';

export interface Householder {
  name: string;
  status: HouseholderStatus;
  surname?: string;
  fatherName?: string;
  nationalId?: string;
  nationality?: string;
  religion?: Religion;
  cityOfBirth?: City;
  gender?: Gender;
  issuedAt?: City;
}
