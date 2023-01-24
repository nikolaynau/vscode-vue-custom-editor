import { isDefined, isTextEmpty } from '@/utils/types';
import { isPlainObject } from 'is-plain-object';
import type { DocumentObject, RawDocument } from './types';

export function parseDocument(data: RawDocument | null | undefined): {
  doc: DocumentObject | null;
  err: Error | null;
} {
  let doc: DocumentObject | null = null;
  let err: Error | null = null;

  if (!isDefined(data) || isTextEmpty(data)) {
    return { doc, err };
  }

  if (typeof data === 'string') {
    try {
      const jsonObject = JSON.parse(data);
      if (isDefined(jsonObject) && validateData(jsonObject as DocumentObject)) {
        doc = jsonObject;
      } else {
        err = new Error('rawData must be an object');
      }
    } catch (e) {
      err = e as Error;
    }
  } else if (validateData(data as DocumentObject)) {
    doc = data as DocumentObject;
  } else {
    err = new Error('rawData must be an object or JSON string');
  }

  return { doc, err };
}

function validateData(data: DocumentObject): boolean {
  let valid = true;
  valid = valid && isPlainObject(data);
  valid = valid && typeof data.counter === 'number';
  return valid;
}
